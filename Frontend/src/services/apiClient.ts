import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export const API_URL = "http://localhost:5000/api";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 700;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientError(error: any): boolean {
  const message = String(error?.message ?? error ?? "");
  // Covers Firebase auth network hiccups AND raw browser fetch failures
  // (backend momentarily unreachable - e.g. nodemon restarting mid-request).
  return /network-request-failed|timeout|Failed to fetch|NetworkError|Load failed/i.test(message);
}

function waitForAuthUser(timeoutMs = 6000): Promise<User> {
  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      unsubscribe();
      reject(new Error("User not logged in"));
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timer);
      unsubscribe();
      if (user) resolve(user);
      else reject(new Error("User not logged in"));
    });
  });
}

async function getIdTokenWithRetry(user: User): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await user.getIdToken();
    } catch (error) {
      lastError = error;
      if (!isTransientError(error) || attempt === MAX_RETRIES) throw error;
      await sleep(RETRY_DELAY_MS * (attempt + 1));
    }
  }

  throw lastError;
}

async function parseResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || JSON.stringify(data));
  }
  return data;
}

/**
 * Wraps the actual network call (not just token acquisition) with retry
 * on transient failures. "Failed to fetch" from the browser means the
 * request never got a response at all - most commonly a backend that
 * was momentarily unreachable (a dev server restarting mid-request is
 * the classic case). Retrying once or twice resolves this almost every
 * time without the user needing to manually retry.
 */
async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      if (!isTransientError(error) || attempt === MAX_RETRIES) throw error;
      await sleep(RETRY_DELAY_MS * (attempt + 1));
    }
  }

  throw lastError;
}

export async function authedFetch(path: string, options: RequestInit = {}) {
  const user = await waitForAuthUser();
  const token = await getIdTokenWithRetry(user);

  const response = await fetchWithRetry(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  return parseResponse(response);
}

export async function authedUpload(path: string, formData: FormData) {
  const user = await waitForAuthUser();
  const token = await getIdTokenWithRetry(user);

  const response = await fetchWithRetry(`${API_URL}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  return parseResponse(response);
}
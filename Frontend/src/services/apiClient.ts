import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export const API_URL = "http://localhost:5000/api";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 700;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientAuthError(error: any): boolean {
  const message = String(error?.message ?? error ?? "");
  return /network-request-failed|timeout|Failed to fetch|NetworkError/i.test(message);
}

/**
 * Firebase persists your login, but restoring it from storage on page
 * load is ASYNC. Right after a hard refresh, `auth.currentUser` can
 * still be null for a brief moment even though you ARE logged in -
 * this waits for the first real auth state instead of assuming null
 * means "not logged in."
 */
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
      if (!isTransientAuthError(error) || attempt === MAX_RETRIES) throw error;
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

export async function authedFetch(path: string, options: RequestInit = {}) {
  const user = await waitForAuthUser();
  const token = await getIdTokenWithRetry(user);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  return parseResponse(response);
}

/** For file uploads - no Content-Type here on purpose, the browser sets
 * the correct multipart boundary automatically for FormData bodies. */
export async function authedUpload(path: string, formData: FormData) {
  const user = await waitForAuthUser();
  const token = await getIdTokenWithRetry(user);

  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  return parseResponse(response);
}
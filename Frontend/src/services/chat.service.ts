import { auth } from "../lib/firebase";

const API_URL = "http://localhost:5000/api";

export interface ChatRequest {
  message: string;
  provider?: string;
}

export async function sendMessage(body: ChatRequest) {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not logged in");
    }
console.log("Current User:", user);

    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

console.log("Status:", response.status);
console.log("Backend Response:", data);

if (!response.ok) {
  throw new Error(JSON.stringify(data));
}

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
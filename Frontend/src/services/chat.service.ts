const API_URL = "http://localhost:5000/api";

export interface ChatRequest {
  message: string;
  provider?: string;
}

export async function sendMessage(body: ChatRequest) {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("Status:", response.status);

    const data = await response.json();
    console.log("Response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to send message");
    }

    return data;
  } catch (err) {
    console.error("Fetch Error:", err);
    throw err;
  }
}
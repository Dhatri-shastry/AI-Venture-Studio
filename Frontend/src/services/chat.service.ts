const API_URL = "http://localhost:5000/api";

export interface ChatRequest {

    message: string;

    provider?: string;

}

export async function sendMessage(

    body: ChatRequest

) {

    const response = await fetch(

        `${API_URL}/chat`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(body)

        }

    );

    if (!response.ok) {

        throw new Error("Failed to send message");

    }

    return response.json();

}
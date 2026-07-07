export class GroqProvider {

    private apiKey: string;
    private model: string;
    private readonly endpoint = "https://api.groq.com/openai/v1/chat/completions";

    constructor() {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            throw new Error("GROQ_API_KEY is not set");
        }

        this.apiKey = apiKey;
        this.model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
    }

    async generate(prompt: string): Promise<string> {
        const res = await fetch(this.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                messages: [{ role: "user", content: prompt }],
            }),
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Groq API error (${res.status}): ${errText}`);
        }

        const data = await res.json();
        return data?.choices?.[0]?.message?.content ?? "";
    }

}

export class OpenRouterProvider {

    private apiKey: string;
    private model: string;
    private readonly endpoint = "https://openrouter.ai/api/v1/chat/completions";

    constructor() {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            throw new Error("OPENROUTER_API_KEY is not set");
        }

        this.apiKey = apiKey;
        this.model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
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
            throw new Error(`OpenRouter API error (${res.status}): ${errText}`);
        }

        const data = await res.json();
        return data?.choices?.[0]?.message?.content ?? "";
    }

}

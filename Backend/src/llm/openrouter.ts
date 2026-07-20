import { isTransientError } from "./errors";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

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

    private async request(prompt: string): Promise<string> {
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
            const error: any = new Error(`OpenRouter API error (${res.status}): ${errText}`);
            error.status = res.status;
            throw error;
        }

        const data = await res.json();
        return data?.choices?.[0]?.message?.content ?? "";
    }

    async generate(prompt: string): Promise<string> {
        let lastError: unknown;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                return await this.request(prompt);
            } catch (error) {
                lastError = error;

                if (!isTransientError(error) || attempt === MAX_RETRIES) {
                    throw error;
                }

                const delay = BASE_DELAY_MS * 2 ** attempt;
                console.warn(`OpenRouterProvider: transient error (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delay}ms`);
                await sleep(delay);
            }
        }

        throw lastError;
    }

}

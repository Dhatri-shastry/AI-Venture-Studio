import { GeminiProvider } from "./gemini";
import { GroqProvider } from "./groq";
import { OpenRouterProvider } from "./openrouter";

export type LLMProviderName = "gemini" | "groq" | "openrouter";

interface LLMProvider {
    generate(prompt: string): Promise<string>;
}

export class LLMRouter {

    private providers = new Map<LLMProviderName, LLMProvider>();

    private getProvider(name: LLMProviderName): LLMProvider {
        if (!this.providers.has(name)) {
            switch (name) {
                case "gemini":
                    this.providers.set(name, new GeminiProvider());
                    break;
                case "groq":
                    this.providers.set(name, new GroqProvider());
                    break;
                case "openrouter":
                    this.providers.set(name, new OpenRouterProvider());
                    break;
                default:
                    throw new Error(`Provider not supported: ${name}`);
            }
        }

        return this.providers.get(name)!;
    }

    async ask(provider: string, prompt: string): Promise<string> {
        const name = (provider || process.env.DEFAULT_LLM_PROVIDER || "gemini") as LLMProviderName;

        try {
            return await this.getProvider(name).generate(prompt);
        } catch (error) {
            console.error(`LLMRouter: provider "${name}" failed`, error);
            throw error;
        }
    }

}

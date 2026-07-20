import { GeminiProvider } from "./gemini";
import { GroqProvider } from "./groq";
import { OpenRouterProvider } from "./openrouter";

export type LLMProviderName = "gemini" | "groq" | "openrouter";

interface LLMProvider {
    generate(prompt: string): Promise<string>;
}

const ALL_PROVIDERS: LLMProviderName[] = ["gemini", "groq", "openrouter"];

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

    /**
     * Builds the order providers get tried in: the one the caller asked
     * for, then whatever's in LLM_FALLBACK_ORDER (default: all three),
     * with duplicates removed. This is what makes fallback automatic -
     * no code elsewhere needs to know or care that a fallback happened.
     */
    private fallbackOrder(requested: LLMProviderName): LLMProviderName[] {
        const configured = (process.env.LLM_FALLBACK_ORDER || "gemini,groq,openrouter")
            .split(",")
            .map((p) => p.trim())
            .filter((p): p is LLMProviderName => (ALL_PROVIDERS as string[]).includes(p));

        return [requested, ...configured].filter((p, i, arr) => arr.indexOf(p) === i);
    }

    /**
     * Tries the requested provider first; if it fails for ANY reason
     * (quota exhausted, overloaded, missing API key, network error), it
     * automatically moves to the next provider in the fallback chain
     * instead of failing the whole request. A provider with no API key
     * configured just throws immediately in getProvider() and gets
     * skipped like any other failure - you don't need all three keys
     * set for this to work, only the ones you actually want in the chain.
     *
     * Each individual provider (gemini.ts/groq.ts/openrouter.ts) already
     * retries transient 503/429 errors internally with backoff - this
     * fallback only kicks in once a provider has exhausted ITS OWN
     * retries, or immediately for non-transient failures (like a missing
     * key or an expired one).
     */
    async ask(provider: string, prompt: string): Promise<string> {
        const requested = (provider || process.env.DEFAULT_LLM_PROVIDER || "gemini") as LLMProviderName;
        const order = this.fallbackOrder(requested);

        let lastError: unknown;

        for (let i = 0; i < order.length; i++) {
            const name = order[i];

            try {
                const result = await this.getProvider(name).generate(prompt);

                if (i > 0) {
                    console.warn(`LLMRouter: "${requested}" was unavailable - fell back to "${name}" successfully`);
                }

                return result;
            } catch (error) {
                lastError = error;
                const reason = (error as Error)?.message ?? error;
                const isLast = i === order.length - 1;

                console.error(`LLMRouter: provider "${name}" failed${isLast ? "" : ", trying next in fallback chain"}`, reason);
            }
        }

        throw lastError;
    }

    /**
     * Voice-to-text and image understanding currently only go through
     * Gemini (Groq/OpenRouter here are text-only chat completion APIs).
     * No fallback chain for these - if Gemini is down, these features
     * fail rather than silently degrading, since there's no equivalent
     * to fall back to.
     */
    async transcribeAudio(audioBase64: string, mimeType: string): Promise<string> {
        const provider = this.getProvider("gemini") as GeminiProvider;
        return provider.transcribeAudio(audioBase64, mimeType);
    }

    async describeImage(imageBase64: string, mimeType: string, focus?: string): Promise<string> {
        const provider = this.getProvider("gemini") as GeminiProvider;
        return provider.describeImage(imageBase64, mimeType, focus);
    }

}

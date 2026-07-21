import { GeminiProvider } from "./gemini";
import { GroqProvider } from "./groq";
import { OpenRouterProvider } from "./openrouter";

export type LLMProviderName = "gemini" | "groq" | "openrouter";

interface LLMProvider {
    generate(prompt: string): Promise<string>;
}

const ALL_PROVIDERS: LLMProviderName[] = ["gemini", "groq", "openrouter"];

/**
 * "I need a fast reasoning model" / "I need a deep research model" /
 * "I need a high-quality writing model" - callers that don't care WHICH
 * provider answers, only what kind of job it's doing, ask by capability
 * instead of hardcoding a provider name. Each capability maps to a
 * preference order; the first provider with a usable API key wins,
 * with the same automatic fallback chain as ask().
 *
 * Override via env without a code change, e.g.:
 *   LLM_CAPABILITY_FAST=groq,gemini,openrouter
 *   LLM_CAPABILITY_DEEP=gemini,openrouter,groq
 *   LLM_CAPABILITY_WRITING=gemini,openrouter,groq
 */
export type LLMCapability = "fast" | "deep" | "writing";

const DEFAULT_CAPABILITY_ORDER: Record<LLMCapability, LLMProviderName[]> = {
    // Lightweight classification/planning calls (intent routing, research
    // query planning) - latency matters more than depth here.
    fast: ["groq", "gemini", "openrouter"],
    // Research-heavy specialist agent answers - favor the stronger
    // reasoning model first.
    deep: ["gemini", "openrouter", "groq"],
    // Final synthesis / report prose - favor whichever model writes the
    // most coherent long-form Markdown.
    writing: ["gemini", "openrouter", "groq"],
};

function capabilityOrderFromEnv(capability: LLMCapability): LLMProviderName[] {
    const envKey = `LLM_CAPABILITY_${capability.toUpperCase()}`;
    const configured = process.env[envKey];

    if (!configured) return DEFAULT_CAPABILITY_ORDER[capability];

    const parsed = configured
        .split(",")
        .map((p) => p.trim())
        .filter((p): p is LLMProviderName => (ALL_PROVIDERS as string[]).includes(p));

    return parsed.length > 0 ? parsed : DEFAULT_CAPABILITY_ORDER[capability];
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
        return this.runOrder(order, requested, prompt);
    }

    /**
     * Capability-based entry point: "give me a fast/deep/writing model"
     * instead of naming a provider. Falls through the same try/fallback
     * chain as ask(), just ordered by what the capability prefers. If
     * `preferredProvider` is given (e.g. the user's own provider choice
     * from the UI) it's tried first, then the capability's own order.
     */
    async askForCapability(capability: LLMCapability, prompt: string, preferredProvider?: string): Promise<string> {
        const capabilityOrder = capabilityOrderFromEnv(capability);
        const preferred = preferredProvider as LLMProviderName | undefined;
        const order = preferred
            ? [preferred, ...capabilityOrder].filter((p, i, arr) => arr.indexOf(p) === i)
            : capabilityOrder;

        return this.runOrder(order, order[0], prompt);
    }

    private async runOrder(order: LLMProviderName[], requestedLabel: LLMProviderName, prompt: string): Promise<string> {
        let lastError: unknown;

        for (let i = 0; i < order.length; i++) {
            const name = order[i];

            try {
                const result = await this.getProvider(name).generate(prompt);

                if (i > 0) {
                    console.warn(`LLMRouter: "${requestedLabel}" was unavailable - fell back to "${name}" successfully`);
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

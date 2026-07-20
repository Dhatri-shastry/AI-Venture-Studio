/**
 * Shared error classification used across every LLM provider's retry
 * logic AND the router's fallback logic. One place to tune what counts
 * as "worth retrying/falling back on" instead of duplicating slightly
 * different regexes in gemini.ts, groq.ts, openrouter.ts, router.ts.
 */
export function isTransientError(error: any): boolean {
    const status = error?.status ?? error?.code;
    const message = String(error?.message ?? error ?? "");

    return (
        status === 503 ||
        status === 429 ||
        /503|429|overloaded|unavailable|rate limit|quota/i.test(message)
    );
}

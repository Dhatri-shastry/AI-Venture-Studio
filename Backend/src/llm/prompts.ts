/**
 * Shared prompt-building helpers used across agents and RAG-aware nodes.
 */

// Kept intentionally light - agent personas already carry their own tone
// rules (see Base.Agent.ts). This is only for the rare calls (like
// buildUtilityPrompt) that go straight to the LLM without an agent
// persona wrapped around them.
export const SYSTEM_PREFACE =
    "You're a sharp, experienced startup mentor chatting with a founder - not a report generator. " +
    "Be concise and natural. Only use structured sections or headings if the user explicitly asked for a full report or deep analysis. " +
    "Default to INDIA and INR (₹) for any price/investment/revenue figures unless the founder's context clearly points elsewhere - never default to USD or US-only examples.";

/**
 * Injects retrieved RAG context (if any) into a prompt without having to
 * change every agent's buildPrompt() signature. Deliberately does NOT
 * prepend SYSTEM_PREFACE here - agent prompts already define their own
 * tone/format rules, and stacking a second, slightly different set of
 * instructions on top of theirs is how you end up with mixed signals
 * (part of why responses used to default to rigid report formatting).
 */
export function withContext(prompt: string, context?: string): string {
    if (!context || !context.trim()) {
        return prompt;
    }

    return `${prompt}\n\nRelevant context from prior project docs/chats (use only what's actually relevant - don't just recite it):\n${context}`;
}

/**
 * Wraps a plain question for a "utility" LLM call (used by llm.tool.ts,
 * and by the supervisor's own direct calls) where we don't want the full
 * agent persona/format machinery, just the general conversational tone.
 */
export function buildUtilityPrompt(question: string): string {
    return `${SYSTEM_PREFACE}\n\n${question}`;
}

/**
 * Small, dependency-free helpers for reading intent out of the raw user
 * message. Kept separate from the supervisor/controller so anywhere that
 * needs to know "did they ask for a report?" or "is this a brainstorm
 * request?" stays in sync instead of drifting apart with duplicated,
 * slightly-different keyword lists.
 */

const REPORT_TRIGGERS = [
    "generate report",
    "create report",
    "full report",
    "detailed report",
    "deep analysis",
    "write up a report",
    "give me a report",
    "validation report",
    "make a report",
];

export function wantsReport(text: string): boolean {
    const lower = text.toLowerCase();
    return REPORT_TRIGGERS.some((trigger) => lower.includes(trigger));
}

const GREETING_PATTERN = /^(hi|hey|hello|yo|sup|good\s(morning|afternoon|evening))\b/i;

export function isGreeting(text: string): boolean {
    const trimmed = text.trim();
    return trimmed.length > 0 && trimmed.length < 25 && GREETING_PATTERN.test(trimmed);
}

const BRAINSTORM_PATTERN =
    /\b(startup ideas|business ideas|give me( some)? ideas|brainstorm|ideas for|any ideas)\b/i;

/**
 * "Give me fintech startup ideas" shouldn't get gated behind clarifying
 * questions or routed through a full agent analysis - it's a quick-list
 * request. Detected separately from the specialty agents so the
 * supervisor can answer it directly.
 */
export function isBrainstormRequest(text: string): boolean {
    return BRAINSTORM_PATTERN.test(text);
}

/**
 * Very rough proxy for "is there enough substance here for a specialist
 * agent to say something real, or would it just be guessing?" A short
 * word-count floor is crude but cheap, and it's easy to tune later
 * without touching the supervisor's control flow.
 */
export function hasEnoughContext(text: string, minWords = 12): boolean {
    return text.trim().split(/\s+/).filter(Boolean).length >= minWords;
}
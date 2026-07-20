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
    /\b(startup ideas|business ideas|give me( some)? ideas|brainstorm|ideas for|any ideas|suggest( some)? ideas|top \d+ ideas|options for me|what should i (do|build|start|pursue))\b/i;

/**
 * "Give me fintech startup ideas" shouldn't get gated behind clarifying
 * questions or routed through a full agent analysis - it's answered
 * directly by the supervisor. Detected separately from the specialty
 * agents so it always gets the ranked/structured treatment (see
 * supervisor.node.ts) regardless of which topic it's about.
 */
export function isBrainstormRequest(text: string): boolean {
    return BRAINSTORM_PATTERN.test(text);
}

const IDEA_COUNT_PATTERN = /\b(\d+)\b[^\d]{0,25}\b(ideas|options|choices|suggestions)\b/i;

/**
 * How many ideas were explicitly asked for ("top 10 ideas" -> 10),
 * defaulting to 5 when no number was given - enough to actually rank
 * and compare without becoming an unreadable wall.
 */
export function extractIdeaCount(text: string, fallback = 5): number {
    const match = text.match(IDEA_COUNT_PATTERN);
    const count = match?.[1] ? parseInt(match[1], 10) : fallback;
    return Number.isFinite(count) && count > 0 ? Math.min(count, 15) : fallback;
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

const RESEARCH_TRIGGERS = [
    "current",
    "latest",
    "recent",
    "today",
    "this year",
    "right now",
    "up to date",
    "up-to-date",
    "who are",
    "how much funding",
    "funding round",
    "raised",
    "trends in",
    "news",
    "benchmark",
    "how big is the market",
    "market size",
    "unique",
    "differentiate",
    "differentiation",
    "stand out",
    "competitor",
    "competitors",
    "competition",
    "similar to",
    "already exist",
    "already exists",
    "already out there",
    "typical price",
    "average price",
    "average cost",
    "how many people",
    "statistics",
    "stats on",
    "growing market",
];

/**
 * Rough signal for "answering this well requires facts the model can't
 * be trusted to know from training alone" - competitor names, funding
 * numbers, current pricing, recent trends. When true, the supervisor
 * runs a live web search and hands the results to whichever agents run,
 * instead of letting them guess at real-world specifics.
 */
export function wantsResearch(text: string): boolean {
    const lower = text.toLowerCase();
    return RESEARCH_TRIGGERS.some((trigger) => lower.includes(trigger));
}

/**
 * Light fallback signal only - the primary decision-brief detection
 * lives in supervisor.node.ts's classifyMessage LLM call (same lesson
 * as agent routing: keyword matching alone is too fragile for open-
 * ended phrasing like "should I do this" vs "is this worth pursuing").
 * This just catches the most explicit, unambiguous phrasings cheaply
 * without needing the classifier call to fire correctly every time.
 */
const DECISION_BRIEF_TRIGGERS = [
    "decision brief",
    "full analysis",
    "complete analysis",
    "should i start",
    "should i do this",
    "should i pursue",
    "should i build this",
    "is this worth pursuing",
    "is this worth doing",
    "go or no go",
    "full validation",
    "everything about this idea",
];

export function wantsDecisionBrief(text: string): boolean {
    const lower = text.toLowerCase();
    return DECISION_BRIEF_TRIGGERS.some((trigger) => lower.includes(trigger));
}

export type InvestorPersona = "sequoia" | "yc" | "vc" | "";

const INVESTOR_PERSONA_PATTERN = /think like (a |an )?(sequoia|y ?combinator|yc|vc|venture capitalist|top investor)/i;

export function wantsInvestorPersona(text: string): boolean {
    return INVESTOR_PERSONA_PATTERN.test(text) || /investor mode/i.test(text);
}

/**
 * Which specific investor lens was asked for, if any - "sequoia" and
 * "yc" get their own recognizable philosophy; anything else generic
 * ("think like a VC", "investor mode") just gets "vc".
 */
export function extractInvestorPersona(text: string): InvestorPersona {
    const lower = text.toLowerCase();
    if (lower.includes("sequoia")) return "sequoia";
    if (lower.includes("y combinator") || lower.includes("ycombinator") || /\byc\b/.test(lower)) return "yc";
    if (wantsInvestorPersona(text)) return "vc";
    return "";
}

const SIMULATION_PATTERN = /simulate\s+(\d+)?\s*(customers|users|buyers)/i;

export function wantsCustomerSimulation(text: string): boolean {
    return SIMULATION_PATTERN.test(text);
}

/**
 * How many synthetic customers to simulate - defaults to 50 (matching
 * the example in the spec) when no number was given.
 */
export function extractSimulationCount(text: string): number {
    const match = text.match(SIMULATION_PATTERN);
    const count = match?.[1] ? parseInt(match[1], 10) : 50;
    return Number.isFinite(count) && count > 0 ? Math.min(count, 200) : 50;
}

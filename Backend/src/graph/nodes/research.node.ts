import { VentureState } from "../state";
import { runWebSearch } from "../../tools/search.tool";
import { searchLocalBusinesses, formatLocalBusinesses } from "../../tools/places.tool";
import { wantsResearch } from "../../agents/promptintent";
import { agentsNeedResearch } from "../edges";
import { LLMRouter } from "../../llm/router";

const router = new LLMRouter();

interface ResearchPlan {
    webQuery: string;
    isLocalBusinessQuery: boolean;
    localSearchQuery: string;
}

/**
 * One LLM call plans the whole research step:
 *  - a clean web search query, with business/location/industry specifics
 *    pulled in from conversation history when the raw message is vague
 *    about them (e.g. "who are the competitors near uttarahalli" only
 *    makes sense as a search once you know this conversation is about a
 *    plant-delivery startup called Vrinda)
 *  - whether this is actually a "find/count real local businesses near
 *    a specific place" question - which general web search (Tavily)
 *    genuinely cannot answer well, since it crawls articles/pages, not
 *    structured local business directories. That needs Google Places,
 *    a different tool entirely.
 *  - if so, a clean "<business type> in <place>" query formatted the
 *    way a business directory search expects (e.g. "plant nursery
 *    Uttarahalli Bangalore"), not a full sentence.
 *
 * Falls back to using the raw message as both queries, with local
 * search off, if the call or parse fails - a planning hiccup shouldn't
 * block research entirely.
 */
async function planResearch(
    message: string,
    history: string,
    provider: VentureState["provider"]
): Promise<ResearchPlan> {
    const fallback: ResearchPlan = { webQuery: message, isLocalBusinessQuery: false, localSearchQuery: "" };

    try {
        const historyBlock = history.trim() ? `\n\nConversation so far:\n${history.trim()}` : "";

        const raw = await router.ask(
            provider,
            `A founder said: "${message}"${historyBlock}\n\n` +
            `Plan the research needed to answer this well. Respond with ONLY raw JSON, no markdown fences:\n` +
            `{\n` +
            `  "webQuery": "a clean, well-formed web search query - pull in specific business/location/industry details from the conversation if the message alone is vague",\n` +
            `  "isLocalBusinessQuery": true or false - true only if this is asking to find or count REAL local businesses near a SPECIFIC place (a neighborhood, area, or city), not a general market/industry question,\n` +
            `  "localSearchQuery": "if isLocalBusinessQuery is true: a short '<business type> in <specific place>' style query for a business directory search, e.g. 'plant nursery Uttarahalli Bangalore'. Empty string otherwise."\n` +
            `}`
        );

        const cleaned = raw.replace(/```json|```/gi, "").trim();
        const parsed = JSON.parse(cleaned);

        return {
            webQuery: typeof parsed.webQuery === "string" && parsed.webQuery.trim() ? parsed.webQuery.trim() : message,
            isLocalBusinessQuery: Boolean(parsed.isLocalBusinessQuery),
            localSearchQuery: typeof parsed.localSearchQuery === "string" ? parsed.localSearchQuery.trim() : "",
        };
    } catch (error) {
        console.error("planResearch: failed, falling back to raw message / web-only search", error);
        return fallback;
    }
}

/**
 * Runs between "supervisor" and the agent fan-out. Live research happens
 * when either is true:
 *  - one of the selected agents (market/competitor/investor) inherently
 *    needs real-world current facts to do its job at all - this is the
 *    default for those agents, not something gated behind the founder
 *    happening to use the right keyword
 *  - `wantsResearch` catches other cases (e.g. an innovation/startup
 *    question about "latest trends") as a supplementary signal
 *
 * When it does, ALWAYS runs a general web search, and ADDITIONALLY runs
 * a Google Places lookup when the question is specifically about real
 * local businesses near a place - the two are complementary, not
 * either/or (web search might surface funding/trend context that Places
 * never would, and vice versa for "how many X are near me").
 *
 * No-op (and cheap) when neither trigger applies - most short chat
 * replies don't need any of this.
 */
export async function researchNode(state: VentureState): Promise<Partial<VentureState>> {
    const needsResearch = agentsNeedResearch(state.selectedAgents) || wantsResearch(state.message);

    if (!needsResearch) {
        return {};
    }

    const plan = await planResearch(state.message, state.history, state.provider);

    const [webFindings, localBusinesses] = await Promise.all([
        runWebSearch(plan.webQuery).catch((error) => {
            console.error("researchNode: web search failed, continuing without it", error);
            return "";
        }),
        plan.isLocalBusinessQuery && plan.localSearchQuery
            ? searchLocalBusinesses(plan.localSearchQuery).catch((error) => {
                  console.error("researchNode: local business search failed, continuing without it", error);
                  return [];
              })
            : Promise.resolve([]),
    ]);

    const localBlock = formatLocalBusinesses(localBusinesses);
    const researchFindings = [localBlock, webFindings].filter(Boolean).join("\n\n---\n\n");

    return { researchFindings };
}

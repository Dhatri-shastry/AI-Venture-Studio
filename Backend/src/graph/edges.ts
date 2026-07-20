import { VentureState } from "./state";

export const AGENT_NODE_NAMES = [
    "startup",
    "market",
    "competitor",
    "investor",
    "innovation",
    "customerPersona",
    "pricing",
    "businessModel",
    "financial",
    "swot",
    "risk",
    "gtm",
    "technical",
    "marketing",
    "regulatory",
] as const;

// Agents whose whole job is answering about real-world, current facts -
// who else exists, what the market looks like, what a VC would actually
// see. For these, live research isn't an edge case triggered by magic
// keywords in the user's message - it's the default, because the agent
// literally cannot do its job well without it.
const RESEARCH_DEFAULT_AGENTS = ["market", "competitor", "investor"] as const;

export function agentsNeedResearch(selectedAgents: string[]): boolean {
    return selectedAgents.some((agent) => (RESEARCH_DEFAULT_AGENTS as readonly string[]).includes(agent));
}

/**
 * Conditional edge used right after "supervisor". If the supervisor
 * already produced the full reply itself (greeting, clarifying
 * question, off-topic redirect, quick brainstorm - selectedAgents is
 * empty in all of these), there's nothing left to do but merge
 * (a no-op pass-through when `outputs` is empty). Otherwise, every
 * agent-delegating path goes through "research" first - see
 * research.node.ts for the actual decision on whether a live search
 * is worth running.
 */
export function routeAfterSupervisor(state: VentureState): string[] {
    return state.selectedAgents.length === 0 ? ["merge"] : ["research"];
}

/**
 * Conditional edge used right after "research". Fans the graph out to
 * every agent node the supervisor selected, so they run as parallel
 * branches that all join back up at "merge".
 */
export function routeToSelectedAgents(state: VentureState): string[] {
    const valid = state.selectedAgents.filter((agent) =>
        (AGENT_NODE_NAMES as readonly string[]).includes(agent)
    );

    return valid.length > 0 ? valid : ["startup"];
}

import { VentureState } from "./state";

export const AGENT_NODE_NAMES = [
    "startup",
    "market",
    "competitor",
    "investor",
    "innovation",
] as const;

/**
 * Conditional edge function used after "supervisor". Fans the graph out
 * to every agent node the supervisor selected, so they run as parallel
 * branches that all join back up at "merge".
 *
 * If the supervisor didn't select any agents at all, that's not an
 * error - it means it already produced the reply itself (a greeting,
 * a clarifying question, a quick brainstorm list) and `finalReport` is
 * already set. In that case we skip every agent and go straight to
 * "merge", which is a no-op pass-through when there's nothing in
 * `outputs`.
 */
export function routeToSelectedAgents(state: VentureState): string[] {
    if (state.selectedAgents.length === 0) {
        return ["merge"];
    }

    const valid = state.selectedAgents.filter((agent) =>
        (AGENT_NODE_NAMES as readonly string[]).includes(agent)
    );

    return valid.length > 0 ? valid : ["startup"];
}
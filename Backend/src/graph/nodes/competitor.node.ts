import { VentureState } from "../state";
import { CompetitorAgent } from "../../agents/competitor.agent";
import { runAgentNode } from "./_shared";

export async function competitorNode(
    state: VentureState
): Promise<Partial<VentureState>> {
    return runAgentNode("competitor", new CompetitorAgent(), state);
}

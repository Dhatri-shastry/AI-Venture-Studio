import { VentureState } from "../state";
import { MarketResearchAgent } from "../../agents/market.agent";
import { runAgentNode } from "./_shared";

export async function marketNode(
    state: VentureState
): Promise<Partial<VentureState>> {
    return runAgentNode("market", new MarketResearchAgent(), state);
}

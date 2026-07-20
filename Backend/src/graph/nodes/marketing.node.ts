import { VentureState } from "../state";
import { MarketingAgent } from "../../agents/marketing.agent";
import { runAgentNode } from "./_shared";

export async function marketingNode(state: VentureState): Promise<Partial<VentureState>> {
    return runAgentNode("marketing", new MarketingAgent(), state);
}

import { VentureState } from "../state";
import { PricingAgent } from "../../agents/pricing.agent";
import { runAgentNode } from "./_shared";

export async function pricingNode(state: VentureState): Promise<Partial<VentureState>> {
    return runAgentNode("pricing", new PricingAgent(), state);
}

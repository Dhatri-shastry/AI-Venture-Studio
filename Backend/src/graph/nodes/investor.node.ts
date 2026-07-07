import { VentureState } from "../state";
import { InvestorAgent } from "../../agents/investor.agent";
import { runAgentNode } from "./_shared";

export async function investorNode(
    state: VentureState
): Promise<Partial<VentureState>> {
    return runAgentNode("investor", new InvestorAgent(), state);
}

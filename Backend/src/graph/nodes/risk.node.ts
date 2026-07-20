import { VentureState } from "../state";
import { RiskAgent } from "../../agents/risk.agent";
import { runAgentNode } from "./_shared";

export async function riskNode(state: VentureState): Promise<Partial<VentureState>> {
    return runAgentNode("risk", new RiskAgent(), state);
}

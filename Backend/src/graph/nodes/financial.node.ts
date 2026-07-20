import { VentureState } from "../state";
import { FinancialAgent } from "../../agents/financial.agent";
import { runAgentNode } from "./_shared";

export async function financialNode(state: VentureState): Promise<Partial<VentureState>> {
    return runAgentNode("financial", new FinancialAgent(), state);
}

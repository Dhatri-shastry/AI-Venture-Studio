import { VentureState } from "../state";
import { CustomerPersonaAgent } from "../../agents/customerPersona.agent";
import { runAgentNode } from "./_shared";

export async function customerPersonaNode(state: VentureState): Promise<Partial<VentureState>> {
    return runAgentNode("customerPersona", new CustomerPersonaAgent(), state);
}

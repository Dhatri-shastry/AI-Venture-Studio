import { VentureState } from "../state";
import { BusinessModelAgent } from "../../agents/businessModel.agent";
import { runAgentNode } from "./_shared";

export async function businessModelNode(state: VentureState): Promise<Partial<VentureState>> {
    return runAgentNode("businessModel", new BusinessModelAgent(), state);
}

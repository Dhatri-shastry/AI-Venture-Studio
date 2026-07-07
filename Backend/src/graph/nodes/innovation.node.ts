import { VentureState } from "../state";
import { InnovationAgent } from "../../agents/innovation.agent";
import { runAgentNode } from "./_shared";

export async function innovationNode(
    state: VentureState
): Promise<Partial<VentureState>> {
    return runAgentNode("innovation", new InnovationAgent(), state);
}

import { VentureState } from "../state";
import { TechnicalAgent } from "../../agents/technical.agent";
import { runAgentNode } from "./_shared";

export async function technicalNode(state: VentureState): Promise<Partial<VentureState>> {
    return runAgentNode("technical", new TechnicalAgent(), state);
}

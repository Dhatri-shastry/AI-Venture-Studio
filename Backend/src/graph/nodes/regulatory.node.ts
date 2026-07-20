import { VentureState } from "../state";
import { RegulatoryAgent } from "../../agents/regulatory.agent";
import { runAgentNode } from "./_shared";

export async function regulatoryNode(state: VentureState): Promise<Partial<VentureState>> {
    return runAgentNode("regulatory", new RegulatoryAgent(), state);
}

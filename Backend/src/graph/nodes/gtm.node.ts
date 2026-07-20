import { VentureState } from "../state";
import { GTMAgent } from "../../agents/gtm.agent";
import { runAgentNode } from "./_shared";

export async function gtmNode(state: VentureState): Promise<Partial<VentureState>> {
    return runAgentNode("gtm", new GTMAgent(), state);
}

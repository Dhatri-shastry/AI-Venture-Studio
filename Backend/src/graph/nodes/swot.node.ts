import { VentureState } from "../state";
import { SWOTAgent } from "../../agents/swot.agent";
import { runAgentNode } from "./_shared";

export async function swotNode(state: VentureState): Promise<Partial<VentureState>> {
    return runAgentNode("swot", new SWOTAgent(), state);
}

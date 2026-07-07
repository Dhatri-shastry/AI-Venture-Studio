import { VentureState } from "../state";
import { StartupValidationAgent } from "../../agents/startup.agent";
import { runAgentNode } from "./_shared";

export async function startupNode(
    state: VentureState
): Promise<Partial<VentureState>> {
    return runAgentNode("startup", new StartupValidationAgent(), state);
}

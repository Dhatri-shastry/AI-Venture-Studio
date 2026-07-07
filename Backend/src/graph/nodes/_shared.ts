import { VentureState } from "../state";
import { BaseAgent } from "../../agents/Base.Agent";
import { LLMRouter } from "../../llm/router";
import { withContext } from "../../llm/prompts";

const router = new LLMRouter();

/**
 * Shared execution logic for every "run one agent against the user's
 * message" node (startup, market, competitor, investor, innovation).
 * Keeps each node file to a one-liner while staying easy to override
 * per-agent later if one of them needs special handling.
 *
 * Forwards `state.reportMode` (set by the supervisor when the user
 * explicitly asked for a full report/deep analysis) so the agent knows
 * whether to write a structured report or answer conversationally.
 */
export async function runAgentNode(
    outputKey: string,
    agent: BaseAgent,
    state: VentureState
): Promise<Partial<VentureState>> {

    const basePrompt = agent.buildPrompt(
        state.message,
        { reportMode: state.reportMode }
    );

    const prompt = withContext(basePrompt, state.context);

    const result = await router.ask(state.provider, prompt);

    return {
        outputs: {
            [outputKey]: result,
        },
    };
}
import { VentureState } from "../state";
import { BaseAgent } from "../../agents/Base.Agent";
import { LLMRouter } from "../../llm/router";
import { withContext } from "../../llm/prompts";

const router = new LLMRouter();

/**
 * Shared execution logic for every "run one agent against the user's
 * message" node (startup, market, competitor, investor, etc). Keeps
 * each node file to a one-liner while staying easy to override
 * per-agent later if one of them needs special handling.
 *
 * Forwards:
 *  - state.reportMode       - structured report vs conversational answer
 *  - state.history          - prior turns of this conversation (chat memory)
 *  - state.projectProfile   - persistent venture memory (idea, users,
 *    pricing, competitors, roadmap - survives across the whole project,
 *    not just recent messages)
 *  - state.researchFindings - live web/local-business search results,
 *    when the selected agents needed current real-world facts
 *  - state.investorPersona  - "sequoia"/"yc"/"vc" when the founder asked
 *    to hear a specific investor lens
 *  - state.responseFormat   - "comparison"/"validation"/"brainstorm"/
 *    "plan"/"factual"/"conversational" - which structural shape actually
 *    fits this request (the universal response framework)
 */
export async function runAgentNode(
    outputKey: string,
    agent: BaseAgent,
    state: VentureState
): Promise<Partial<VentureState>> {

    const basePrompt = agent.buildPrompt(
        state.message,
        {
            reportMode: state.reportMode,
            history: state.history,
            projectProfile: state.projectProfile,
            researchFindings: state.researchFindings,
            attachmentContext: state.attachmentContext,
            investorPersona: state.investorPersona,
            responseFormat: state.responseFormat,
        }
    );

    const prompt = withContext(basePrompt, state.context);

    const result = await router.ask(state.provider, prompt);

    return {
        outputs: {
            [outputKey]: result,
        },
    };
}
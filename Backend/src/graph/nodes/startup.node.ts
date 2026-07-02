import { VentureState } from "../state";

import { StartupValidationAgent } from "../../agents/startupValidation.agent";

import { LLMRouter } from "../../llm/router";

export async function startupNode(

    state: VentureState

): Promise<VentureState> {

    const router = new LLMRouter();

    const agent = new StartupValidationAgent();

    const prompt = agent.buildPrompt(

        state.message

    );

    const result = await router.ask(

        state.provider,

        prompt

    );

    return {

        ...state,

        outputs: {

            ...state.outputs,

            startup: result

        }

    };

}
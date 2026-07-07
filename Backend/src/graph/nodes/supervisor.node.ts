import { VentureState } from "../state";
import { LLMRouter } from "../../llm/router";
import { AgentType } from "../../agents/agent.types";
import {
    isGreeting,
    isBrainstormRequest,
    hasEnoughContext,
    wantsReport,
} from "../../agents/promptintent";

const router = new LLMRouter();

function detectAgents(text: string): AgentType[] {
    const lower = text.toLowerCase();
    const agents: AgentType[] = [];

    if (lower.includes("startup") || lower.includes("idea") || lower.includes("validate") || lower.includes("feasib")) {
        agents.push("startup");
    }

    if (lower.includes("market") || lower.includes("tam") || lower.includes("sam") || lower.includes("customer") || lower.includes("trend")) {
        agents.push("market");
    }

    if (lower.includes("competitor") || lower.includes("competition") || lower.includes("rival")) {
        agents.push("competitor");
    }

    // No dedicated Financial agent exists in the codebase yet - pricing/
    // revenue/unit-economics questions are the closest fit for the
    // Investor agent (which already covers revenue model + scalability).
    if (
        lower.includes("invest") || lower.includes("funding") || lower.includes("valuation") || lower.includes("vc") ||
        lower.includes("pricing") || lower.includes("revenue") || lower.includes("unit economics")
    ) {
        agents.push("investor");
    }

    if (lower.includes("roadmap") || lower.includes("innovation") || lower.includes("feature") || lower.includes("differentiat")) {
        agents.push("innovation");
    }

    return Array.from(new Set(agents));
}

/**
 * Router with four outcomes, checked in order:
 *
 * 1. Greeting / small talk -> reply directly, no agents.
 * 2. Brainstorm request ("give me startup ideas") -> answer immediately
 *    with a short list, no agents, no clarifying questions first.
 * 3. Enough signal to know the topic, but too thin to analyze -> ask a
 *    couple of short clarifying questions, no agents.
 * 4. Enough to work with -> pick the minimum set of specialist agents
 *    and flag whether the user explicitly wants a full report.
 */
export async function supervisorNode(state: VentureState): Promise<VentureState> {
    const text = state.message.trim();

    if (!text) {
        return { ...state, selectedAgents: [], finalReport: "What are you working on today?" };
    }

    // 1. Small talk - just chat back, don't touch any agents.
    if (isGreeting(text)) {
        const reply = await router.ask(
            state.provider,
            `Someone just said: "${text}". Reply the way a real person would in a casual chat - ` +
            `exactly 1 short, warm sentence, and naturally invite them to share what they're working on. ` +
            `No self-introduction, no "As an AI", no headers.`
        );

        return { ...state, selectedAgents: [], finalReport: reply };
    }

    // 2. Brainstorm - give value immediately, don't gate behind questions.
    if (isBrainstormRequest(text)) {
        const ideas = await router.ask(
            state.provider,
            `Someone asked: "${text}". Give 5-10 concise ideas that fit the request. One line each, ` +
            `bold the idea name followed by a short dash and a one-sentence explanation - no paragraphs, ` +
            `no intro before the list, no numbered sections. After the list, you can add one optional, ` +
            `short follow-up question if it would genuinely help narrow things down - not required.`
        );

        return { ...state, selectedAgents: [], finalReport: ideas };
    }

    const reportRequested = wantsReport(text);
    const agents = detectAgents(text);

    // 3. Not enough meat here yet to actually analyze anything, regardless
    // of whether we can guess a topic - ask before guessing.
    if (!hasEnoughContext(text)) {
        const clarify = await router.ask(
            state.provider,
            `Someone said: "${text}". That's not enough to give a real answer yet. Respond like a ` +
            `curious, sharp startup mentor: acknowledge what they said in one short line, then ask 2-3 ` +
            `short, specific follow-up questions (as a bullet list) that would actually help. Natural ` +
            `chat tone, no numbered report sections, no long preamble.`
        );

        return { ...state, selectedAgents: [], finalReport: clarify };
    }

    // 4. Enough to work with - route to only the agents actually implicated,
    // falling back to the general-purpose startup agent if the message is
    // clearly substantive but doesn't match a specific specialty.
    const selectedAgents = agents.length > 0 ? agents : (["startup"] as AgentType[]);

    return {
        ...state,
        selectedAgents,
        reportMode: reportRequested,
    };
}
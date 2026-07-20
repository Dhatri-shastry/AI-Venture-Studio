import { VentureState } from "../state";
import { LLMRouter } from "../../llm/router";
import { AgentType } from "../../agents/agent.types";
import { AGENT_NODE_NAMES } from "../edges";
import {
    isGreeting,
    isBrainstormRequest,
    extractIdeaCount,
    hasEnoughContext,
    wantsReport,
    wantsDecisionBrief,
    wantsInvestorPersona,
    extractInvestorPersona,
    wantsCustomerSimulation,
    extractSimulationCount,
} from "../../agents/promptintent";

const router = new LLMRouter();

function historyBlock(history: string): string {
    return history.trim() ? `\n\nConversation so far:\n${history.trim()}\n` : "";
}

function profileBlock(profile: string): string {
    return profile.trim() ? `\n\nWhat's known about this venture already:\n${profile.trim()}\n` : "";
}

function isKnownAgent(agent: string): agent is AgentType {
    return (AGENT_NODE_NAMES as readonly string[]).includes(agent);
}

interface Classification {
    onTopic: boolean;
    agents: AgentType[];
    decisionBrief: boolean;
}

function parseClassification(raw: string): Classification | null {
    try {
        const cleaned = raw.replace(/```json|```/gi, "").trim();
        const parsed = JSON.parse(cleaned);
        const agents = Array.isArray(parsed.agents) ? parsed.agents.filter(isKnownAgent) : [];
        return {
            onTopic: Boolean(parsed.onTopic),
            agents,
            decisionBrief: Boolean(parsed.decisionBrief),
        };
    } catch {
        return null;
    }
}

/**
 * Single LLM call that replaces what used to be two separate,
 * keyword-based steps: detecting which of the 15 agents apply, and a
 * follow-up check for whether the message is even on-topic. Also now
 * detects genuine "should I do this" decision-brief requests as a
 * third dimension, for the same reason - keyword matching alone
 * ("should i start") misses "is this worth pursuing," "go or no go,"
 * and endless other phrasings of the same underlying question.
 *
 * Fails closed to a safe default (on-topic, general "startup" agent,
 * no decision brief) if the call or parse fails, so a classifier
 * hiccup degrades gracefully instead of blocking the founder entirely.
 */
async function classifyMessage(
    text: string,
    provider: VentureState["provider"],
    history: string
): Promise<Classification> {
    try {
        const raw = await router.ask(
            provider,
            `You're the routing layer for a startup-strategy product. A founder said: "${text}"${historyBlock(history)}\n\n` +
            `Decide three things:\n` +
            `1. Is this on-topic - about startups, entrepreneurship, or running/growing a business ` +
            `(validation, market, competitors, customers, pricing, business model, finances, SWOT, risk, ` +
            `go-to-market, technical approach, marketing, regulatory/legal, funding/investors, product/roadmap), ` +
            `OR a follow-up to an ongoing on-topic conversation? Typos and casual/slangy phrasing don't make ` +
            `it off-topic - judge the actual intent.\n` +
            `2. If on-topic, which of these specialist lanes actually apply (pick only what's truly relevant, ` +
            `usually 1-2): startup, market, competitor, investor, innovation, customerPersona, pricing, ` +
            `businessModel, financial, swot, risk, gtm, technical, marketing, regulatory.\n` +
            `3. Is this a genuine comprehensive "should I do this" validation question - the founder wants a ` +
            `full go/no-go decision on the whole venture, not just one angle of it? (e.g. "should I start this ` +
            `business", "is this worth pursuing", "give me the full picture") - true only for that kind of ` +
            `broad, decisive question, not a normal specific question.\n\n` +
            `Respond with ONLY raw JSON, no markdown fences, no explanation:\n` +
            `{"onTopic": true or false, "agents": ["lane1", "lane2"], "decisionBrief": true or false}`
        );

        const parsed = parseClassification(raw);
        if (parsed) return parsed;

        console.error("classifyMessage: could not parse classifier response, defaulting to on-topic/startup:", raw);
        return { onTopic: true, agents: ["startup"], decisionBrief: false };
    } catch (error) {
        console.error("classifyMessage: classification call failed, defaulting to on-topic/startup", error);
        return { onTopic: true, agents: ["startup"], decisionBrief: false };
    }
}

/**
 * Router with these outcomes, checked in order:
 *
 * 1. Greeting / small talk -> reply directly, no agents.
 * 2. Brainstorm request ("give me startup ideas") -> answer immediately
 *    with a short list, no agents, no clarifying questions first.
 * 3. Customer simulation ("simulate 50 customers") -> a labeled,
 *    explicitly-estimated reaction breakdown, no specialist agents.
 * 4. Enough signal to know the topic, but too thin to analyze -> ask a
 *    couple of short clarifying questions, no agents.
 * 5. Off-topic (not startup/business related, and not a continuation of
 *    an on-topic conversation) -> a short, friendly redirect, no agents.
 * 6. On-topic and substantive -> the classifier's chosen agents run. If
 *    this is a genuine decision-brief request, EVERY specialist agent
 *    runs instead of just the relevant 1-2, reportMode is forced on,
 *    and synthesis.node.ts (after merge) weaves it all into one
 *    coherent brief. If an investor persona was requested, the
 *    Investor agent is guaranteed to be included and told which lens
 *    to use.
 */
export async function supervisorNode(state: VentureState): Promise<VentureState> {
    const text = state.message.trim();
    const history = historyBlock(state.history);
    const hasAttachment = Boolean(state.attachmentContext?.trim());

    if (!text && !hasAttachment) {
        return { ...state, selectedAgents: [], finalReport: "What are you working on today?" };
    }

    // 1. Small talk - just chat back, don't touch any agents.
    if (isGreeting(text) && !history && !hasAttachment) {
        const reply = await router.ask(
            state.provider,
            `Someone just said: "${text}". Reply the way a real person would in a casual chat - ` +
            `exactly 1 short, warm sentence, and naturally invite them to share what they're working on. ` +
            `No self-introduction, no "As an AI", no headers.`
        );

        return { ...state, selectedAgents: [], finalReport: reply };
    }

    // 2. Idea/comparison requests get a structured, ranked breakdown -
    // not a chat reply. This is a genuinely different kind of ask than
    // "who's my competitor": the founder wants a comparable deliverable
    // (ranked options with tradeoffs), so it's deliberately exempt from
    // the normal agent conversational length cap. Personalized against
    // whatever's known (budget, location, existing business, student/
    // professional status) from the project profile and chat history.
    if (isBrainstormRequest(text)) {
        const count = extractIdeaCount(text);
        const knownContext = `${profileBlock(state.projectProfile)}${history}`;

        const ideas = await router.ask(
            state.provider,
            `Someone asked: "${text}"${knownContext}\n\n` +
            `Generate their top ${count} ideas, ranked BEST to WORST specifically for THEIR situation. ` +
            `Infer constraints (budget, location, existing context, student/professional status, etc) from ` +
            `what's known above and actually use them to rank and tailor recommendations - don't give generic, ` +
            `interchangeable ideas. Be specific with numbers (₹/$ amounts, %, timeframes) rather than vague terms ` +
            `like "low cost" - estimate directly rather than hedging into vagueness. If truly nothing is known ` +
            `about their situation, rank by general opportunity/ease and say so plainly in the Final Recommendation.\n\n` +
            `Respond in EXACTLY this Markdown structure:\n\n` +
            `# Top ${count} ${/business|startup/i.test(text) ? "Business Ideas" : "Ideas"}\n` +
            `## 1. [Idea name] - [star rating, e.g. ⭐⭐⭐⭐⭐, reflecting fit for THIS founder's constraints]\n` +
            `- Problem:\n- Target Customers:\n- Investment:\n- Profit Margin:\n` +
            `- Execution Steps (Week 1 / Month 1):\n- Marketing Strategy:\n- Risks:\n` +
            `## 2. [repeat the same fields for every idea, ranked best to worst]\n` +
            `...\n\n` +
            `# Comparison Table\n` +
            `| Idea | Investment | Profit Potential | Difficulty | Fit for You |\n` +
            `|---|---|---|---|---|\n` +
            `(one row per idea, "Fit for You" as a star rating)\n\n` +
            `# Final Recommendation\n` +
            `(which one to actually pursue and why - be direct, don't hedge, and say what to validate first)\n\n` +
            `Keep each bullet under 2 lines. If the founder explicitly asked for something brief/quick instead ` +
            `(e.g. "just a quick list"), ignore the structure above and give a much shorter one-line-per-idea list instead.`
        );

        return { ...state, selectedAgents: [], finalReport: ideas };
    }

    // 3. Customer simulation - a self-contained estimation exercise, not
    // a specialist-agent question. Explicitly labeled as simulated/
    // estimated so it's never mistaken for real survey data.
    if (wantsCustomerSimulation(text)) {
        const count = extractSimulationCount(text);
        const simulation = await router.ask(
            state.provider,
            `Simulate ${count} potential customers reacting to this founder's business, based on what's known ` +
            `about it below. If you don't actually know enough about the business/target customer from the ` +
            `context to simulate meaningfully, say so plainly and ask what the idea is - don't guess blindly.` +
            `${profileBlock(state.projectProfile)}${history}\n\nFounder said: "${text}"\n\n` +
            `If you do know enough: break the ${count} into realistic buckets (e.g. "love it," "hesitant about ` +
            `price," "don't understand the value," "would buy immediately") with a count and one-line reason ` +
            `for each bucket - counts must sum to ${count}. Start with a one-line label making clear this is a ` +
            `simulated, directional ESTIMATE based on reasoning about the target customer, not real survey data.`
        );

        return { ...state, selectedAgents: [], finalReport: simulation };
    }

    // 4. Not enough meat here yet to actually analyze anything - ask
    // before guessing. Skipped once there's real conversation history or
    // an attachment, since by then there's usually enough accumulated
    // context even if this one message is short.
    if (!hasEnoughContext(text) && !state.history && !hasAttachment) {
        const clarify = await router.ask(
            state.provider,
            `Someone said: "${text}". That's not enough to give a real answer yet. Respond like a ` +
            `curious, sharp startup mentor: acknowledge what they said in one short line, then ask 2-3 ` +
            `short, specific follow-up questions (as a bullet list) that would actually help. Natural ` +
            `chat tone, no numbered report sections, no long preamble.`
        );

        return { ...state, selectedAgents: [], finalReport: clarify };
    }

    // 5/6. One classification call decides on-topic, which agents apply,
    // and whether this is a full decision-brief request.
    const reportRequested = wantsReport(text);
    const { onTopic, agents, decisionBrief: classifierDecisionBrief } = await classifyMessage(
        text,
        state.provider,
        state.history
    );
    const decisionBrief = wantsDecisionBrief(text) || classifierDecisionBrief;

    if (!onTopic && !hasAttachment && !decisionBrief) {
        const redirect = await router.ask(
            state.provider,
            `Someone asked: "${text}". This is outside what you do - you're built specifically for ` +
            `startup strategy, validation, and business execution, not general questions. Respond in ` +
            `1-2 short, friendly sentences: briefly note that's outside your lane, and invite them to ` +
            `bring you a startup/business question instead. No lecturing, no long explanation, no headers.`
        );

        return { ...state, selectedAgents: [], finalReport: redirect };
    }

    let selectedAgents: AgentType[] = decisionBrief
        ? ([...AGENT_NODE_NAMES] as AgentType[])
        : agents.length > 0
            ? agents
            : (["startup"] as AgentType[]);

    const investorPersonaRequested = wantsInvestorPersona(text);
    if (investorPersonaRequested && !selectedAgents.includes("investor")) {
        selectedAgents = [...selectedAgents, "investor"];
    }

    return {
        ...state,
        selectedAgents,
        reportMode: reportRequested || decisionBrief,
        decisionBrief,
        investorPersona: investorPersonaRequested ? extractInvestorPersona(text) : "",
    };
}

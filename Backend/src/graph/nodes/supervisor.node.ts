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

/**
 * Prints the routing decision to the backend console - exactly what was
 * requested for verifying the router is actually choosing the correct
 * workflow instead of silently falling back to a default. One honest
 * note: this architecture doesn't have a separate "ResearchAgent" the
 * way the requested example implies - research (web search + local
 * business lookup) is a pipeline step (research.node.ts) that runs
 * automatically based on which specialist agents are selected, not an
 * agent with its own output section. So this logs all 15 real agent
 * lanes with ✓/✗, which is the accurate equivalent.
 */
function logRoutingDecision(
    message: string,
    projectProfile: string,
    decisionBrief: boolean,
    responseFormat: string,
    selectedAgents: string[]
): void {
    const intent = decisionBrief ? "decision_brief" : responseFormat;
    const projectContext = projectProfile.trim()
        ? projectProfile.trim().split("\n")[0].slice(0, 80)
        : "(no active project)";

    console.log(`[Supervisor] Message: "${message.slice(0, 80)}${message.length > 80 ? "..." : ""}"`);
    console.log(`[Supervisor] Intent: ${intent}`);
    console.log(`[Supervisor] Project Context: ${projectContext}`);
    console.log(`[Supervisor] Agents Selected:`);

    for (const agent of AGENT_NODE_NAMES) {
        const selected = selectedAgents.includes(agent);
        console.log(`  ${selected ? "✓" : "✗"} ${agent}${selected ? "" : " (skipped)"}`);
    }
}

function isKnownAgent(agent: string): agent is AgentType {
    return (AGENT_NODE_NAMES as readonly string[]).includes(agent);
}

type ResponseFormat = "comparison" | "validation" | "brainstorm" | "plan" | "factual" | "conversational";

const KNOWN_FORMATS: readonly ResponseFormat[] = [
    "comparison",
    "validation",
    "brainstorm",
    "plan",
    "factual",
    "conversational",
];

function isKnownFormat(format: string): format is ResponseFormat {
    return (KNOWN_FORMATS as readonly string[]).includes(format);
}

interface Classification {
    onTopic: boolean;
    agents: AgentType[];
    decisionBrief: boolean;
    responseFormat: ResponseFormat;
}

function parseClassification(raw: string): Classification | null {
    try {
        const cleaned = raw.replace(/```json|```/gi, "").trim();
        const parsed = JSON.parse(cleaned);
        const agents = Array.isArray(parsed.agents) ? parsed.agents.filter(isKnownAgent) : [];
        const responseFormat = typeof parsed.responseFormat === "string" && isKnownFormat(parsed.responseFormat)
            ? parsed.responseFormat
            : "conversational";
        return {
            onTopic: Boolean(parsed.onTopic),
            agents,
            decisionBrief: Boolean(parsed.decisionBrief),
            responseFormat,
        };
    } catch {
        return null;
    }
}

/**
 * Single LLM call that replaces what used to be several separate,
 * keyword-based steps: detecting which of the 15 agents apply, whether
 * the message is even on-topic, and now ALSO which response format
 * fits - the universal response framework. This is what makes the same
 * agent produce a ranked comparison table for "suggest me one
 * profitable business" but a short direct answer for "what does TAM
 * mean" - format adapts to intent instead of every agent having one
 * fixed output shape, and instead of relying on a keyword list to catch
 * every possible phrasing of "this is a comparison request" (which
 * reliably misses things - "suggest me one X" and "how does A compare
 * to B and C" don't contain any brainstorm-style keywords but are
 * exactly the kind of request that needs ranked options + a table).
 *
 * Fails closed to a safe default (on-topic, general "startup" agent,
 * conversational format) if the call or parse fails, so a classifier
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
            `Decide four things:\n` +
            `1. Is this on-topic - about startups, entrepreneurship, or running/growing a business ` +
            `(validation, market, competitors, customers, pricing, business model, finances, SWOT, risk, ` +
            `go-to-market, technical approach, marketing, regulatory/legal, funding/investors, product/roadmap), ` +
            `OR a follow-up to an ongoing on-topic conversation? Typos and casual/slangy phrasing don't make ` +
            `it off-topic - judge the actual intent.\n` +
            `2. If on-topic, which of these specialist lanes actually apply: startup, market, competitor, ` +
            `investor, innovation, customerPersona, pricing, businessModel, financial, swot, risk, gtm, ` +
            `technical, marketing, regulatory. STRICT RULE: select the MINIMUM set that covers what was asked - ` +
            `if the question is entirely about ONE thing (e.g. only competitors, only pricing), return ONLY that ` +
            `one lane. Do NOT add "startup" or any other lane "for completeness" or "just in case" - every extra ` +
            `lane you add produces an extra section in the final answer that the founder didn't ask for. Only use ` +
            `"startup" when nothing more specific applies at all.\n` +
            `   CRITICAL: a new, specific request is a NEW intent, even if the conversation history shows a ` +
            `different workflow (e.g. a full validation) already happened earlier. Do NOT re-run or fold in the ` +
            `previous workflow just because it's recent in the history - route ONLY to what the LATEST message is ` +
            `actually asking for. Worked example: history shows a founder already got a full startup validation ` +
            `for their AI interview-prep platform, and their next message is "Analyze the competitors for an ` +
            `AI-powered interview preparation platform" -> agents: ["competitor"] ONLY. Do NOT include "startup" ` +
            `and do NOT treat this as continuing the validation - the venture/context carries over, but the ` +
            `WORKFLOW switches entirely to competitor analysis.\n` +
            `3. Is this a genuine comprehensive "should I do this" validation question - the founder wants a ` +
            `full go/no-go decision on the whole venture, not just one angle of it? (e.g. "should I start this ` +
            `business", "is this worth pursuing", "give me the full picture") - true only for that kind of ` +
            `broad, decisive question. If the conversation history shows a comprehensive validation/decision ` +
            `brief was ALREADY given earlier, and this message asks about one specific aspect (competitors, ` +
            `pricing, financials, etc) rather than re-asking "should I do this," this is FALSE - a narrow ` +
            `follow-up about one aspect is never itself a new comprehensive decision-brief request.\n` +
            `4. Which response format actually fits what's being asked:\n` +
            `   - "comparison": the founder wants to choose between options, even if they only asked for "one" ` +
            `recommendation - a good advisor evaluates several candidates before recommending (e.g. "suggest me a ` +
            `profitable business," "which domain should I pick," "AI tutoring, special ed, or vocational upskilling ` +
            `- how does this compare"). Also applies to "which is best" even with no options listed yet.\n` +
            `   - "validation": the founder wants strengths/weaknesses/risks/verdict on ONE specific idea they've ` +
            `already named (not choosing between options).\n` +
            `   - "brainstorm": the founder explicitly wants a list of ideas/options generated.\n` +
            `   - "plan": the founder wants a roadmap/execution plan/steps to do something.\n` +
            `   - "factual": a simple factual question with a direct answer (e.g. "what does TAM mean," "how many ` +
            `people did I say I want to hire").\n` +
            `   - "conversational": anything else - small talk continuation, a quick opinion, doesn't need special ` +
            `structure.\n\n` +
            `Respond with ONLY raw JSON, no markdown fences, no explanation:\n` +
            `{"onTopic": true or false, "agents": ["lane1", "lane2"], "decisionBrief": true or false, "responseFormat": "one of the six formats above"}`
        );

        const parsed = parseClassification(raw);
        if (parsed) return parsed;

        console.error("classifyMessage: could not parse classifier response, defaulting to on-topic/startup:", raw);
        return { onTopic: true, agents: ["startup"], decisionBrief: false, responseFormat: "conversational" };
    } catch (error) {
        console.error("classifyMessage: classification call failed, defaulting to on-topic/startup", error);
        return { onTopic: true, agents: ["startup"], decisionBrief: false, responseFormat: "conversational" };
    }
}

/**
 * Router with these outcomes, checked in order:
 *
 * 1. Greeting / small talk -> reply directly, no agents. Aware of
 *    persistent project memory - a greeting inside an established
 *    project gets a "welcome back" referencing where things left off.
 * 2. Idea/comparison requests -> a structured, ranked breakdown, not a
 *    chat reply - personalized against known constraints.
 * 3. Customer simulation ("simulate 50 customers") -> a labeled,
 *    explicitly-estimated reaction breakdown, no specialist agents.
 * 4. Not enough context yet -> clarifying questions, no agents.
 * 5/6. On-topic and substantive -> the classifier's chosen agents run,
 *    with a decision brief forcing every agent + synthesis for genuine
 *    "should I do this" questions, and responseFormat threaded through
 *    to shape how each agent actually structures its answer.
 */
export async function supervisorNode(state: VentureState): Promise<VentureState> {
    const text = state.message.trim();
    const history = historyBlock(state.history);
    const hasAttachment = Boolean(state.attachmentContext?.trim());

    if (!text && !hasAttachment) {
        return { ...state, selectedAgents: [], finalReport: "What are you working on today?" };
    }

    // 1. Small talk - just chat back, don't touch any agents. If there's
    // no chat-level history (fresh chat) but a project profile exists
    // (returning to an established venture), welcome them back with
    // real context instead of a blank "what are you working on" - this
    // is the actual fix for "Hi -> Welcome back to your Vrinda project."
    if (isGreeting(text) && !history && !hasAttachment) {
        const hasProjectMemory = Boolean(state.projectProfile?.trim());

        const reply = await router.ask(
            state.provider,
            hasProjectMemory
                ? `Someone just said: "${text}" - they're opening a new chat within an existing project. ` +
                  `Here's what's known about it:\n${state.projectProfile.trim()}\n\n` +
                  `Welcome them back warmly in 2-3 short sentences: briefly reference where things left off ` +
                  `(don't dump the whole profile back at them), then suggest a natural next step or ask what ` +
                  `they want to work on. No self-introduction, no "As an AI", no headers.`
                : `Someone just said: "${text}". Reply the way a real person would in a casual chat - ` +
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
    // whether this is a full decision-brief request, and which response
    // format fits (the universal response framework).
    const reportRequested = wantsReport(text);
    const {
        onTopic,
        agents,
        decisionBrief: classifierDecisionBrief,
        responseFormat,
    } = await classifyMessage(text, state.provider, state.history);
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

    logRoutingDecision(text, state.projectProfile, decisionBrief, responseFormat, selectedAgents);

    return {
        ...state,
        selectedAgents,
        reportMode: reportRequested || decisionBrief,
        decisionBrief,
        investorPersona: investorPersonaRequested ? extractInvestorPersona(text) : "",
        responseFormat,
    };
}
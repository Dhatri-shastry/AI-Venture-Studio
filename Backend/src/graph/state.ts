import { Annotation } from "@langchain/langgraph";

export const VentureStateAnnotation = Annotation.Root({
    userId: Annotation<string | undefined>(),
    projectId: Annotation<string | undefined>(),
    chatId: Annotation<string | undefined>(),
    message: Annotation<string>(),
    provider: Annotation<"gemini" | "groq" | "openrouter">(),

    // RAG context retrieved from the project's own ingested documents
    // (semantic search - only what's relevant to THIS message).
    context: Annotation<string>({
        reducer: (_, next) => next,
        default: () => "",
    }),

    // The project's persistent profile - idea, target users, pricing,
    // known competitors, roadmap, key decisions. Unlike `context` (which
    // is retrieved by relevance to the current message), this is always
    // included in full when a project is active, so the AI never "forgets"
    // core facts just because the current message doesn't happen to be
    // semantically similar to where they were mentioned. Maintained by
    // updateProjectProfile.node.ts after substantive exchanges.
    projectProfile: Annotation<string>({
        reducer: (_, next) => next,
        default: () => "",
    }),

    // Source labels for whatever ended up in `context`, so agents can be
    // told (lightly) what they're drawing on and mergeNode can add a
    // short "Referenced:" footer instead of citing nothing or making
    // sources up.
    sources: Annotation<string[]>({
        reducer: (_, next) => next,
        default: () => [],
    }),

    // Prior turns of THIS conversation, pre-formatted as plain text.
    // Populated by loadContext.node.ts from Chat.messages when chatId is
    // given. This is what makes memory persistent instead of per-message.
    history: Annotation<string>({
        reducer: (_, next) => next,
        default: () => "",
    }),

    // Live web search + local business findings, populated by
    // research.node.ts when the selected agents need real-world current
    // facts (or promptintent's wantsResearch catches a supplementary case).
    researchFindings: Annotation<string>({
        reducer: (_, next) => next,
        default: () => "",
    }),

    // Text extracted from whatever the founder attached to THIS message
    // (an uploaded doc, a transcribed voice note, or a described photo).
    // Set directly by chat.controller.ts from the client - not looked up
    // by loadContext.node.ts like the fields above.
    attachmentContext: Annotation<string>({
        reducer: (_, next) => next,
        default: () => "",
    }),

    selectedAgents: Annotation<string[]>({
        reducer: (_, next) => next,
        default: () => [],
    }),

    // Set by the supervisor when the user explicitly asked for a full
    // report / deep analysis. Read by the agent prompts (report vs chat
    // mode) and by mergeNode (headed sections vs plain conversational
    // join).
    reportMode: Annotation<boolean>({
        reducer: (_, next) => next,
        default: () => false,
    }),

    // Set by the supervisor for a genuine "should I do this" / full
    // validation question. Runs every specialist agent (not just 1-2),
    // forces reportMode, and routes through synthesis.node.ts afterward
    // to weave all of it into one cohesive Decision Brief instead of a
    // stack of separately-headed agent outputs.
    decisionBrief: Annotation<boolean>({
        reducer: (_, next) => next,
        default: () => false,
    }),

    // "sequoia" | "yc" | "vc" | "" - set when the founder explicitly asks
    // to hear a specific investor lens. Injected into the Investor
    // agent's prompt as a persona instruction.
    investorPersona: Annotation<string>({
        reducer: (_, next) => next,
        default: () => "",
    }),

    // "comparison" | "validation" | "brainstorm" | "plan" | "factual" |
    // "conversational" - set by the supervisor's classification call
    // based on what the founder is actually asking for, not fixed
    // per-agent. This is the universal response framework: the SAME
    // startup/market/whatever agent produces a ranked comparison table
    // for "suggest me one profitable business" but a short direct
    // answer for "what does TAM mean" - the format adapts to intent
    // instead of every agent having one baked-in output shape.
    responseFormat: Annotation<string>({
        reducer: (_, next) => next,
        default: () => "conversational",
    }),

    // Merges rather than overwrites, since multiple agent nodes run in
    // parallel and each one only writes its own key into `outputs`.
    outputs: Annotation<Record<string, string>>({
        reducer: (current, update) => ({ ...current, ...update }),
        default: () => ({}),
    }),

    finalReport: Annotation<string>({
        reducer: (_, next) => next,
        default: () => "",
    }),
});

export type VentureState = typeof VentureStateAnnotation.State;

export const initialVentureState = (
    overrides: Partial<VentureState> & Pick<VentureState, "message" | "provider">
): VentureState => ({
    userId: undefined,
    projectId: undefined,
    chatId: undefined,
    context: "",
    projectProfile: "",
    sources: [],
    history: "",
    researchFindings: "",
    attachmentContext: "",
    selectedAgents: [],
    reportMode: false,
    decisionBrief: false,
    investorPersona: "",
    responseFormat: "conversational",
    outputs: {},
    finalReport: "",
    ...overrides,
});
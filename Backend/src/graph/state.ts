import { Annotation } from "@langchain/langgraph";

export const VentureStateAnnotation = Annotation.Root({
    userId: Annotation<string | undefined>(),
    projectId: Annotation<string | undefined>(),
    chatId: Annotation<string | undefined>(),
    message: Annotation<string>(),
    provider: Annotation<"gemini" | "groq" | "openrouter">(),
    context: Annotation<string>({
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
    selectedAgents: [],
    reportMode: false,
    outputs: {},
    finalReport: "",
    ...overrides,
});
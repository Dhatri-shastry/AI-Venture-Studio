export interface VentureState {

    userId?: string;

    projectId?: string;

    message: string;

    provider: "gemini" | "groq" | "openrouter";

    selectedAgents: string[];

    outputs: Record<string, string>;

    finalReport: string;

}
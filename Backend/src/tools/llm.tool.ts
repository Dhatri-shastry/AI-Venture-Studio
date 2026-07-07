import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { LLMRouter } from "../llm/router";
import { buildUtilityPrompt } from "../llm/prompts";

const schema = z.object({
    question: z.string().describe("A focused question or sub-task to hand off to another LLM call"),
    provider: z
        .enum(["gemini", "groq", "openrouter"])
        .optional()
        .describe("Which provider to use; defaults to gemini"),
});

const router = new LLMRouter();

/**
 * Lets one agent make a focused, isolated LLM call for a sub-question
 * (e.g. "summarize this in one sentence", "translate this term") without
 * dragging its entire persona/output-format prompt along with it.
 */
export const llmCallTool = tool(
    async ({ question, provider }: z.infer<typeof schema>) => {
        const prompt = buildUtilityPrompt(question);
        return router.ask(provider || "gemini", prompt);
    },
    {
        name: "ask_llm",
        description: "Delegates a focused sub-question to an LLM, independent of the calling agent's persona/format.",
        schema,
    }
);

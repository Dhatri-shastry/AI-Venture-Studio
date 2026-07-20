import { Request, Response } from "express";
import { AgentRouter } from "../agents/agentRouter";
import { AgentType } from "../agents/agent.types";
import { LLMRouter } from "../llm/router";
import { withContext } from "../llm/prompts";
import { retrieveContext } from "../rag/retrieval";
import { wantsReport } from "../agents/promptintent";

const agentRouter = new AgentRouter();
const llmRouter = new LLMRouter();

export const executeAgent = async (req: Request, res: Response) => {
    try {
        const { agent, message, provider, projectId, reportMode } = req.body as {
            agent: AgentType;
            message: string;
            provider?: string;
            projectId?: string;
            reportMode?: boolean;
        };

        if (!agent || !message) {
            return res.status(400).json({
                success: false,
                message: "agent and message are required",
            });
        }

        const agentInstance = agentRouter.getAgent(agent);
        const { context } = projectId
            ? await retrieveContext(message, projectId)
            : { context: "" };
        const shouldReport = reportMode ?? wantsReport(message);
        const prompt = withContext(
            agentInstance.buildPrompt(message, { reportMode: shouldReport }),
            context
        );

        const result = await llmRouter.ask(provider || "gemini", prompt);

        res.json({ success: true, agent, result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

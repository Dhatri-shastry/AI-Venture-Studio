import { Request, Response } from "express";
import { AgentRouter } from "../agents/agentRouter";
import { AgentType } from "../agents/agent.types";
import { LLMRouter } from "../llm/router";
import { withContext } from "../llm/prompts";
import { retrieveContext } from "../rag/retrieval";
import { wantsReport } from "../agents/promptintent";

const agentRouter = new AgentRouter();
const llmRouter = new LLMRouter();

/**
 * Runs a single named agent directly, bypassing the full supervisor
 * graph. Useful for testing one agent in isolation, or for a UI that
 * lets the user pick a specific analysis type explicitly.
 *
 * `reportMode` can be passed explicitly by the client; if it's omitted,
 * we fall back to sniffing the message itself for a "generate report"
 * style request so this endpoint behaves consistently with the graph.
 */
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
        const context = projectId ? await retrieveContext(message, projectId) : "";
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
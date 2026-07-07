import { Request, Response } from "express";
import { ventureGraph } from "../graph/graph";
import { initialVentureState } from "../graph/state";

interface AuthedRequest extends Request {
    user?: { uid: string };
}

export const sendMessage = async (req: AuthedRequest, res: Response) => {
    try {
        const { message, provider, projectId, chatId } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const initialState = initialVentureState({
            message,
            provider: provider || "gemini",
            userId: req.user?.uid,
            projectId,
            chatId,
        });

        const result = await ventureGraph.invoke(initialState);

        res.json({
            success: true,
            report: result.finalReport,
            agentsUsed: result.selectedAgents,
            outputs: result.outputs,
            chatId: result.chatId,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

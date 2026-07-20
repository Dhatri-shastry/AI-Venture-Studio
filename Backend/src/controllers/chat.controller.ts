import { Request, Response } from "express";
import { ventureGraph } from "../graph/graph";
import { initialVentureState } from "../graph/state";
import Chat from "../models/Chat";

interface AuthedRequest extends Request {
    user?: { uid: string };
}

export const sendMessage = async (req: AuthedRequest, res: Response) => {
    try {
        const { message, provider, projectId, chatId, attachmentContext } = req.body;

        if (!message && !attachmentContext) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const initialState = initialVentureState({
            message: message || "",
            provider: provider || "gemini",
            userId: req.user?.uid,
            projectId,
            chatId,
            attachmentContext,
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

        const status = (error as any)?.status ?? (error as any)?.code;
        const errorMessage = String((error as Error)?.message ?? error ?? "");
        const isProviderOverloaded =
            status === 503 || status === 429 || /503|429|overloaded|unavailable|rate limit/i.test(errorMessage);

        if (isProviderOverloaded) {
            return res.status(503).json({
                success: false,
                message: "The AI provider is temporarily overloaded. Please try again in a few seconds.",
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

/**
 * Sidebar list: latest chats first, with just enough to render the list
 * (no message bodies - keep this cheap since it can be called often).
 */
export const listChats = async (req: AuthedRequest, res: Response) => {
    try {
        const chats = await Chat.find({ userId: req.user?.uid })
            .select("title provider projectId createdAt updatedAt")
            .sort({ updatedAt: -1 })
            .lean();

        res.json({ success: true, chats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Full conversation for reopening a chat - this is what the frontend
 * calls when the user clicks a chat in the sidebar, to restore the
 * complete message history.
 */
export const getChat = async (req: AuthedRequest, res: Response) => {
    try {
        const chat = await Chat.findOne({
            _id: req.params.chatId,
            userId: req.user?.uid,
        }).lean();

        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.json({ success: true, chat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const renameChat = async (req: AuthedRequest, res: Response) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, message: "title is required" });
        }

        const chat = await Chat.findOneAndUpdate(
            { _id: req.params.chatId, userId: req.user?.uid },
            { title: title.trim() },
            { new: true }
        );

        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.json({ success: true, chat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteChat = async (req: AuthedRequest, res: Response) => {
    try {
        const result = await Chat.deleteOne({
            _id: req.params.chatId,
            userId: req.user?.uid,
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

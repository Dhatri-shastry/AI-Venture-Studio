import { Request, Response } from "express";
import { ventureGraph } from "../graph/graph";
import { initialVentureState, VentureState } from "../graph/state";
import Chat from "../models/Chat";
import { runWithPerf, logPerfSummary } from "../utils/perf";

// Friendly labels streamed to the client while each graph stage runs,
// so the UI can show progress ("Researching market...") instead of a
// blank spinner until the whole response is ready.
const STAGE_LABELS: Record<string, string> = {
    loadContext: "Loading context...",
    supervisor: "Thinking...",
    research: "Researching...",
    startup: "Analyzing your idea...",
    market: "Analyzing market...",
    competitor: "Finding competitors...",
    investor: "Evaluating from an investor's lens...",
    innovation: "Checking differentiation...",
    customerPersona: "Profiling your customers...",
    pricing: "Working out pricing...",
    businessModel: "Mapping the business model...",
    financial: "Running the numbers...",
    swot: "Weighing strengths and risks...",
    risk: "Flagging risks...",
    gtm: "Planning go-to-market...",
    technical: "Assessing feasibility...",
    marketing: "Shaping the marketing angle...",
    regulatory: "Checking regulatory basics...",
    merge: "Compiling the answer...",
    synthesis: "Synthesizing the decision brief...",
    verify: "Double-checking the answer...",
    save: "Saving...",
};

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

        const result = await runWithPerf(() => ventureGraph.invoke(initialState));
        logPerfSummary(chatId || "new-chat");

        res.json({
            success: true,
            report: result.finalReport,
            agentsUsed: result.selectedAgents,
            outputs: result.outputs,
            chatId: result.chatId,
        });
    } catch (error) {
        console.error("========== FULL ERROR ==========");
console.error(error);

if (error instanceof Error) {
  console.error("Message:", error.message);
  console.error("Stack:", error.stack);
}

console.error("===============================");

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
 * Streaming counterpart to sendMessage. Uses LangGraph's own streaming
 * (`streamMode: "updates"`) so the client gets a progress event the
 * moment each stage of the graph finishes, instead of waiting for the
 * whole multi-agent run to complete before seeing anything - this is
 * what makes deep, multi-agent answers feel responsive rather than
 * making the founder stare at a blank screen for 5-10 seconds.
 *
 * Event shapes (each an SSE "event:" + JSON "data:" line):
 *   progress { stage, label }                       - one per finished node
 *   done     { report, agentsUsed, outputs, chatId } - final result
 *   error    { message }                             - on failure
 */
export const sendMessageStream = async (req: AuthedRequest, res: Response) => {
    const { message, provider, projectId, chatId, attachmentContext } = req.body;

    if (!message && !attachmentContext) {
        return res.status(400).json({ success: false, message: "Message is required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const send = (event: string, data: unknown) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    // If the client disconnects early, stop bothering to write - the
    // graph run itself still completes (agents already in flight aren't
    // cancelled), it just won't be streamed to a dead connection.
    let clientClosed = false;
    req.on("close", () => {
        clientClosed = true;
    });

    try {
        const initialState = initialVentureState({
            message: message || "",
            provider: provider || "gemini",
            userId: req.user?.uid,
            projectId,
            chatId,
            attachmentContext,
        });

        let finalState: Partial<VentureState> = {};

        await runWithPerf(async () => {
            const stream = await ventureGraph.stream(initialState, { streamMode: "updates" });

            for await (const chunk of stream) {
                for (const [nodeName, update] of Object.entries(chunk as Record<string, Partial<VentureState>>)) {
                    finalState = { ...finalState, ...update };

                    if (!clientClosed) {
                        send("progress", { stage: nodeName, label: STAGE_LABELS[nodeName] ?? nodeName });
                    }
                }
            }
        });

        logPerfSummary(chatId || "new-chat");

        if (!clientClosed) {
            send("done", {
                report: finalState.finalReport,
                agentsUsed: finalState.selectedAgents,
                outputs: finalState.outputs,
                chatId: finalState.chatId,
            });
        }
    } catch (error) {
        console.error("sendMessageStream error:", error);
        if (!clientClosed) {
            send("error", { message: "Something went wrong generating the response. Please try again." });
        }
    } finally {
        if (!clientClosed) res.end();
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

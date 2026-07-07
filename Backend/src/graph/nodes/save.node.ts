import { VentureState } from "../state";
import Chat from "../../models/Chat";

/**
 * Last node in the graph. Persists the user's message and the merged
 * assistant report to Mongo so chat history survives across requests.
 * Creates a new Chat doc if chatId isn't provided (and stamps the id
 * back onto state so callers can return it to the client).
 */
export async function saveNode(state: VentureState): Promise<Partial<VentureState>> {
    if (!state.userId) {
        // Nothing to persist to without an owner; skip silently.
        return state;
    }

    const newMessages = [
        { role: "user", content: state.message },
        { role: "assistant", content: state.finalReport },
    ];

    if (state.chatId) {
        await Chat.findByIdAndUpdate(state.chatId, {
            $push: { messages: { $each: newMessages } },
        });

        return state;
    }

    const chat = await Chat.create({
        userId: state.userId,
        projectId: state.projectId,
        title: state.message.slice(0, 60),
        provider: state.provider,
        agent: state.selectedAgents.join(","),
        messages: newMessages,
    });

    return {
        ...state,
        chatId: chat._id.toString(),
    };
}

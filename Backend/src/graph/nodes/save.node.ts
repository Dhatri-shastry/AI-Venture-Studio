import { VentureState } from "../state";
import Chat from "../../models/Chat";
import { LLMRouter } from "../../llm/router";
import { updateProjectProfile } from "../../rag/projectProfile";

const router = new LLMRouter();

/**
 * Generates a short, human-readable chat title from the founder's first
 * message, the way ChatGPT/Claude do - "Fintech idea validation" instead
 * of the raw first 60 characters of what they typed. Fails soft to the
 * old slice()-based title if the LLM call errors, so chat creation never
 * breaks over a cosmetic feature.
 */
async function generateTitle(message: string, provider: VentureState["provider"]): Promise<string> {
    if (!message.trim()) {
        return "Attachment";
    }

    try {
        const title = await router.ask(
            provider,
            `Summarize this founder's message as a chat title: 3-6 words, no punctuation at the end, ` +
            `no quotes around it, title case. Just the title, nothing else.\n\nMessage: "${message}"`
        );

        const cleaned = title.trim().replace(/^["']|["']$/g, "");
        return cleaned || message.slice(0, 60);
    } catch (error) {
        console.error("generateTitle: LLM call failed, falling back to truncated message", error);
        return message.slice(0, 60);
    }
}

/**
 * Last node in the graph. Persists the user's message and the merged
 * assistant report to Mongo so chat history survives across requests -
 * this is the actual "never forget previous messages" mechanism:
 * loadContext.node.ts (first node) reads this same Chat doc back out on
 * every subsequent request in the conversation.
 *
 * Creates a new Chat doc (with a generated title) if chatId isn't
 * provided, and stamps the new id back onto state so callers can return
 * it to the client and use it on the next message.
 *
 * Also kicks off the project profile update (see rag/projectProfile.ts)
 * for substantive exchanges - deliberately NOT awaited, so a background
 * memory-maintenance call never adds latency to the response the
 * founder is waiting on.
 */
export async function saveNode(state: VentureState): Promise<Partial<VentureState>> {
    if (!state.userId) {
        // Nothing to persist to without an owner; skip silently.
        return state;
    }

    const newMessages = [
        { role: "user", content: state.message.trim() || "[Attachment]" },
        { role: "assistant", content: state.finalReport },
    ];

    // Fire-and-forget: only worth updating the profile when an actual
    // agent ran (real analysis happened), not for greetings/chitchat/
    // off-topic redirects, which have nothing durable worth recording.
    if (state.projectId && state.selectedAgents.length > 0) {
        updateProjectProfile(state.projectId, state.provider, state.message, state.finalReport).catch((error) =>
            console.error("saveNode: background profile update threw unexpectedly", error)
        );
    }

    if (state.chatId) {
        await Chat.findByIdAndUpdate(state.chatId, {
            $push: { messages: { $each: newMessages } },
        });

        return state;
    }

    const title = await generateTitle(state.message, state.provider);

    const chat = await Chat.create({
        userId: state.userId,
        projectId: state.projectId,
        title,
        provider: state.provider,
        agent: state.selectedAgents.join(","),
        messages: newMessages,
    });

    return {
        chatId: chat._id.toString(),
    };
}

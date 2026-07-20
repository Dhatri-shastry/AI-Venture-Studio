import { VentureState } from "../state";
import { retrieveContext } from "../../rag/retrieval";
import Chat from "../../models/Chat";
import Project from "../../models/Project";

const HISTORY_TURNS = 8;

/**
 * Loads a chat's prior messages and formats them as plain text for
 * injection into every downstream prompt. This is what makes memory
 * persistent across a conversation instead of resetting every message -
 * without it, follow-ups like "what about pricing?" have no idea what
 * "it" refers to.
 */
async function loadHistory(chatId?: string): Promise<string> {
    if (!chatId) {
        return "";
    }

    try {
        const chat = await Chat.findById(chatId).select("messages").lean();
        const recent = (chat?.messages ?? []).slice(-HISTORY_TURNS);

        return recent
            .map((m) => `${m.role === "user" ? "Founder" : "You"}: ${m.content}`)
            .join("\n");
    } catch (error) {
        console.error("loadContextNode: failed to load chat history, continuing without it", error);
        return "";
    }
}

/**
 * Loads the project's persistent profile (idea, target users, pricing,
 * known competitors, roadmap, key decisions) - maintained separately by
 * updateProjectProfile.node.ts after substantive exchanges. Unlike RAG
 * `context` (retrieved by relevance to the current message), this is
 * included in full whenever a project is active, so core facts are
 * never "forgotten" just because they weren't semantically close to
 * the current question.
 */
async function loadProjectProfile(projectId?: string): Promise<string> {
    if (!projectId) {
        return "";
    }

    try {
        const project = await Project.findById(projectId).select("profile").lean();
        return project?.profile ?? "";
    } catch (error) {
        console.error("loadContextNode: failed to load project profile, continuing without it", error);
        return "";
    }
}

/**
 * First node in the graph. Loads RAG context (+ source citations) from
 * the project's own ingested documents, this conversation's prior turns
 * (persistent chat memory), and the project's persistent profile
 * (persistent venture memory). All fail soft: a broken Chroma/Mongo call
 * just leaves that piece empty instead of breaking the whole request.
 *
 * Live web search is NOT decided here - it used to be gated on
 * keyword-matching the raw message ("competitor", "latest", etc), which
 * is fragile against typos and phrasing. That decision lives in
 * research.node.ts, which runs after the supervisor has picked agents.
 */
export async function loadContextNode(state: VentureState): Promise<Partial<VentureState>> {
    const [retrieval, history, projectProfile] = await Promise.all([
        state.projectId
            ? retrieveContext(state.message, state.projectId)
            : Promise.resolve({ context: "", sources: [] as string[] }),
        loadHistory(state.chatId),
        loadProjectProfile(state.projectId),
    ]);

    return {
        context: retrieval.context,
        sources: retrieval.sources,
        history,
        projectProfile,
    };
}

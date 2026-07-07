import { VentureState } from "../state";
import { retrieveContext } from "../../rag/retrieval";

/**
 * First node in the graph. Pulls relevant prior context (ingested docs,
 * research notes) for this project out of the vector store before any
 * agent runs, so every agent's prompt is grounded in project history.
 * If there's no projectId, or the store is empty/unreachable, this is a
 * harmless no-op (state.context stays "").
 */
export async function loadContextNode(state: VentureState): Promise<Partial<VentureState>> {
    if (!state.projectId) {
        return state;
    }

    const context = await retrieveContext(state.message, state.projectId);

    return {
        context,
    };
}

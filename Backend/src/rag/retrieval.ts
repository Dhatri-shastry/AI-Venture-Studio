import { queryDocuments } from "./chroma";

/**
 * Retrieves the most relevant stored context for a query, scoped to a
 * project, and joins it into a single string ready to inject into a prompt.
 * Fails soft: if Chroma is unreachable or empty, returns "" rather than
 * breaking the agent pipeline.
 */
export async function retrieveContext(
    query: string,
    projectId?: string,
    topK = 4
): Promise<string> {
    try {
        const chunks = await queryDocuments(query, topK, projectId);
        return chunks.join("\n\n---\n\n");
    } catch (error) {
        console.error("retrieveContext: Chroma lookup failed, continuing without context", error);
        return "";
    }
}

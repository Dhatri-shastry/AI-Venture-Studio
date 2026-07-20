import { queryDocuments } from "./chroma";

export interface RetrievalResult {
    context: string;
    sources: string[];
}

/**
 * Retrieves the most relevant stored context for a query, scoped to a
 * project, and joins it into a single string ready to inject into a
 * prompt - plus the deduplicated list of source labels it came from, so
 * the response can credit what it actually used instead of citing
 * nothing (or worse, making sources up).
 *
 * Fails soft: if Chroma is unreachable or empty, returns empty context
 * and no sources rather than breaking the agent pipeline.
 */
export async function retrieveContext(
    query: string,
    projectId?: string,
    topK = 4
): Promise<RetrievalResult> {
    try {
        const chunks = await queryDocuments(query, topK, projectId);

        return {
            context: chunks.map((c) => c.text).join("\n\n---\n\n"),
            sources: Array.from(new Set(chunks.map((c) => c.source))),
        };
    } catch (error) {
        console.error("retrieveContext: Chroma lookup failed, continuing without context", error);
        return { context: "", sources: [] };
    }
}

import { randomUUID } from "crypto";
import { embedTexts } from "./embedding";
import { addDocuments, ChunkMetadata } from "./chroma";

const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 100;

/**
 * Simple fixed-size, overlapping character chunker.
 * Good enough for research notes / pasted text / scraped pages;
 * swap for a token-aware splitter later if quality needs it.
 */
export function chunkText(text: string): string[] {
    const clean = text.replace(/\r\n/g, "\n").trim();

    if (clean.length <= CHUNK_SIZE) {
        return [clean];
    }

    const chunks: string[] = [];
    let start = 0;

    while (start < clean.length) {
        const end = Math.min(start + CHUNK_SIZE, clean.length);
        chunks.push(clean.slice(start, end));
        start += CHUNK_SIZE - CHUNK_OVERLAP;
    }

    return chunks;
}

/**
 * Chunks, embeds, and stores a piece of text (e.g. a research note,
 * a pasted article, a scraped competitor page) into the vector store
 * under a given project.
 */
export async function loadTextIntoRAG(
    projectId: string,
    source: string,
    text: string
): Promise<{ chunksAdded: number }> {
    const chunks = chunkText(text);

    if (chunks.length === 0) {
        return { chunksAdded: 0 };
    }

    const embeddings = await embedTexts(chunks);

    const ids = chunks.map(() => randomUUID());
    const metadatas: ChunkMetadata[] = chunks.map((_, i) => ({
        projectId,
        source,
        chunkIndex: i,
    }));

    await addDocuments(ids, chunks, embeddings, metadatas);

    return { chunksAdded: chunks.length };
}

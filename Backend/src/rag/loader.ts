import { randomUUID } from "crypto";
import { embedTexts } from "./embedding";
import { addDocuments, ChunkMetadata } from "./chroma";
import Document from "../models/Document";

const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 100;

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

    // Every ingestion path (pasted text, uploaded file, scraped URL,
    // image/document attachments with a projectId) goes through this
    // one function - recording it here means the Documents tab doesn't
    // need every caller to remember to log it separately. Best-effort:
    // a logging failure shouldn't undo a successful ingestion.
    try {
        await Document.create({ projectId, source, chunksAdded: chunks.length });
    } catch (error) {
        console.error("loadTextIntoRAG: failed to record Document entry (non-fatal)", error);
    }

    return { chunksAdded: chunks.length };
}

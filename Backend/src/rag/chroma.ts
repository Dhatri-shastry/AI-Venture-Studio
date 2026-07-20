import { ChromaClient, Collection } from "chromadb";
import { embedText } from "./embedding";

const COLLECTION_NAME = process.env.CHROMA_COLLECTION || "venture_docs";

let client: ChromaClient | null = null;
let collection: Collection | null = null;

function getClient(): ChromaClient {
    if (!client) {
        client = new ChromaClient({
            path: process.env.CHROMA_URL || "http://localhost:8000",
        });
    }

    return client;
}

async function getCollection(): Promise<Collection> {
    if (!collection) {
        collection = await getClient().getOrCreateCollection({
            name: COLLECTION_NAME,
        });
    }

    return collection;
}

export interface ChunkMetadata {
    projectId: string;
    source: string;
    chunkIndex: number;
    [key: string]: string | number | boolean;
}

export interface RetrievedChunk {
    text: string;
    source: string;
}

export async function addDocuments(
    ids: string[],
    documents: string[],
    embeddings: number[][],
    metadatas: ChunkMetadata[]
): Promise<void> {
    const col = await getCollection();

    await col.add({
        ids,
        documents,
        embeddings,
        metadatas: metadatas as any,
    });
}

/**
 * Queries Chroma for the `topK` chunks most similar to `query`,
 * optionally scoped to a single project. Returns each chunk paired with
 * its source label (the document/URL it came from), so callers can
 * attribute what they use - this is what makes citations possible.
 */
export async function queryDocuments(
    query: string,
    topK = 4,
    projectId?: string
): Promise<RetrievedChunk[]> {
    const col = await getCollection();
    const queryEmbedding = await embedText(query);

    const results = await col.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK,
        where: projectId ? { projectId } : undefined,
    });

    const documents = results.documents?.[0] ?? [];
    const metadatas = results.metadatas?.[0] ?? [];

    return documents
        .map((doc, i) => ({
            text: doc,
            source: (metadatas[i] as any)?.source as string | undefined,
        }))
        .filter((chunk): chunk is RetrievedChunk => chunk.text !== null && chunk.text !== undefined)
        .map((chunk) => ({ text: chunk.text, source: chunk.source || "unknown source" }));
}

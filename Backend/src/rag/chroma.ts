import { ChromaClient, Collection } from "chromadb";
import { embedText } from "./embedding";

const COLLECTION_NAME = process.env.CHROMA_COLLECTION || "venture_docs";

let client: ChromaClient | null = null;
let collection: Collection | null = null;

function getClient(): ChromaClient {
    if (!client) {
        // Defaults to a local Chroma server at http://localhost:8000
        // (run with: pip install chromadb && chroma run --path ./chroma-data)
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

/**
 * Adds pre-chunked text documents (with their own embeddings) to Chroma.
 */
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
 * optionally scoped to a single project.
 */
export async function queryDocuments(
    query: string,
    topK = 4,
    projectId?: string
): Promise<string[]> {
    const col = await getCollection();
    const queryEmbedding = await embedText(query);

    const results = await col.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK,
        where: projectId ? { projectId } : undefined,
    });

    return results.documents?.[0]?.filter((doc): doc is string => doc !== null) ?? [];
}

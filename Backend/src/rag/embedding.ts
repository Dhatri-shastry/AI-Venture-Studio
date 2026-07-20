import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
    if (!client) {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set");
        }

        client = new GoogleGenAI({ apiKey });
    }

    return client;
}

const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004";

// Tiny in-memory cache so re-embedding the exact same query text (e.g. a
// founder re-asking something similar, or retrieval + a tool both
// embedding the same query in one request) doesn't cost an extra API
// call. Capped and cleared on process restart - this is a latency/cost
// optimization, not a durability guarantee.
const embeddingCache = new Map<string, number[]>();
const CACHE_LIMIT = 500;

export async function embedText(text: string): Promise<number[]> {
    const cached = embeddingCache.get(text);
    if (cached) {
        return cached;
    }

    const response = await getClient().models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,
    });

    const values = response.embeddings?.[0]?.values;

    if (!values) {
        throw new Error("Embedding response did not contain values");
    }

    if (embeddingCache.size >= CACHE_LIMIT) {
        const oldestKey = embeddingCache.keys().next().value;
        if (oldestKey !== undefined) {
            embeddingCache.delete(oldestKey);
        }
    }

    embeddingCache.set(text, values);

    return values;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
    const vectors: number[][] = [];

    for (const text of texts) {
        vectors.push(await embedText(text));
    }

    return vectors;
}

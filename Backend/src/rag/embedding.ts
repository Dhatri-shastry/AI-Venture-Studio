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

/**
 * Embeds a single piece of text into a vector.
 */
export async function embedText(text: string): Promise<number[]> {
    const response = await getClient().models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,
    });

    const values = response.embeddings?.[0]?.values;

    if (!values) {
        throw new Error("Embedding response did not contain values");
    }

    return values;
}

/**
 * Embeds many chunks. Runs sequentially to stay well under API rate limits;
 * fine for the ingestion volumes this project deals with.
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
    const vectors: number[][] = [];

    for (const text of texts) {
        vectors.push(await embedText(text));
    }

    return vectors;
}

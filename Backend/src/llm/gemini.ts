import { GoogleGenAI } from "@google/genai";
import { isTransientError } from "./errors";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class GeminiProvider {

    private client: GoogleGenAI;
    private model: string;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set");
        }

        this.client = new GoogleGenAI({ apiKey });
        this.model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    }

    /**
     * Retries transient failures (503 model-overloaded, 429 rate-limited)
     * with exponential backoff before giving up. Gemini's free/shared
     * tier returns 503 fairly often under load - this is Google's
     * server being busy, not a bug in the request, and it usually
     * succeeds on the 2nd or 3rd attempt a second or two later.
     */
    private async callWithRetry<T>(fn: () => Promise<T>): Promise<T> {
        let lastError: unknown;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;

                if (!isTransientError(error) || attempt === MAX_RETRIES) {
                    throw error;
                }

                const delay = BASE_DELAY_MS * 2 ** attempt;
                console.warn(
                    `GeminiProvider: transient error (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delay}ms`,
                    (error as Error)?.message ?? error
                );
                await sleep(delay);
            }
        }

        throw lastError;
    }

    async generate(prompt: string): Promise<string> {
        const response = await this.callWithRetry(() =>
            this.client.models.generateContent({
                model: this.model,
                contents: prompt,
            })
        );

        return response.text ?? "";
    }

    /**
     * Transcribes an audio recording (voice message / mic input) to text.
     * Uses Gemini's native audio understanding rather than a separate
     * speech-to-text API/key - one less credential to manage.
     */
    async transcribeAudio(audioBase64: string, mimeType: string): Promise<string> {
        const response = await this.callWithRetry(() =>
            this.client.models.generateContent({
                model: this.model,
                contents: [
                    { text: "Transcribe this audio exactly as spoken. Return ONLY the transcription - no preamble, no quotes, no commentary. If it's silent or unintelligible, return an empty string." },
                    { inlineData: { data: audioBase64, mimeType } },
                ],
            })
        );

        return (response.text ?? "").trim();
    }

    /**
     * Describes/analyzes an uploaded photo, producing a text summary that
     * gets folded into the conversation as attachment context - so the
     * rest of the pipeline (agents, history, etc) never needs to touch
     * raw image bytes.
     */
    async describeImage(imageBase64: string, mimeType: string, focus?: string): Promise<string> {
        const instruction = focus
            ? `Describe this image in detail, specifically focusing on: ${focus}. Be factual and specific - note any text, numbers, charts, or diagrams visible.`
            : "Describe this image in detail, as if explaining it to someone who can't see it. Note any text, numbers, charts, diagrams, or product/brand details visible.";

        const response = await this.callWithRetry(() =>
            this.client.models.generateContent({
                model: this.model,
                contents: [
                    { text: instruction },
                    { inlineData: { data: imageBase64, mimeType } },
                ],
            })
        );

        return (response.text ?? "").trim();
    }

}

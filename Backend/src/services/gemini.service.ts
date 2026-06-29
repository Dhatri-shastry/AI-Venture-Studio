import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

console.log("Gemini Key:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export class GeminiService {

    async generateResponse(prompt: string) {

        try {

            const response = await ai.models.generateContent({

                model: "gemini-2.5-flash",

                contents: prompt

            });

            return response.text;

        }

        catch (error) {

            console.error(error);

            throw new Error("Gemini Error");

        }

    }

}
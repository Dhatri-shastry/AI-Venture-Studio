import { GeminiService } from "./gemini.service";

export class LLMManager {

    private gemini = new GeminiService();

    async generateResponse(

        message: string,

        provider: string = "gemini"

    ) {

        switch (provider) {

            case "gemini":

                return await this.gemini.generateResponse(message);

            default:

                throw new Error("Unsupported AI Provider");

        }

    }

}
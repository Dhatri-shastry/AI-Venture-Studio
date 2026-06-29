import { LLMManager } from "./llmManager";

export class ChatService {

    private llm = new LLMManager();

    async chat(

        message: string,

        provider = "gemini"

    ) {

        return await this.llm.generateResponse(

            message,

            provider

        );

    }

}
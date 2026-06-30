import { LLMManager } from "./llmManager";
import { AgentRouter } from "../agents/agentRouter";

export class ChatService {

    private llm = new LLMManager();

    private router = new AgentRouter();

    async chat(

        message: string,

        provider = "gemini",

        agent = "startup"

    ){

        const prompt = this.router.route(

            agent,

            message

        );

        return await this.llm.generateResponse(

            prompt,

            provider

        );

    }

}
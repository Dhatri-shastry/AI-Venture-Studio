import { LLMManager } from "./llmManager";
import { AgentRouter } from "../agents/agentRouter";
import { SupervisorAgent } from "../agents/supervisor.agent";
import { ReportService } from "./report.service";

export class ChatService {

    private llm = new LLMManager();

    private router = new AgentRouter();

    private supervisor = new SupervisorAgent();

    private report = new ReportService();

    async chat(

        message:string,

        provider="gemini"

    ){

        const selectedAgents =

            this.supervisor.decideAgents(message);

        const outputs:string[]=[];

        for(const type of selectedAgents){

            const agent = this.router.getAgent(type);

            if(!agent) continue;

            const prompt=

                agent.buildPrompt(message);

            const response=

                await this.llm.generateResponse(

                    prompt,

                    provider

                );

            outputs.push(response);

        }

        return this.report.combine(outputs);

    }

}
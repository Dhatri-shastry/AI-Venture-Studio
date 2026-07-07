import { BaseAgent } from "./Base.Agent";
import { StartupValidationAgent } from "./startup.agent";
import { MarketResearchAgent } from "./market.agent";
import { CompetitorAgent } from "./competitor.agent";
import { InvestorAgent } from "./investor.agent";
import { InnovationAgent } from "./innovation.agent";
import { AgentType } from "./agent.types";

export class AgentRouter {

    private agents: Record<AgentType, () => BaseAgent> = {
        startup: () => new StartupValidationAgent(),
        market: () => new MarketResearchAgent(),
        competitor: () => new CompetitorAgent(),
        investor: () => new InvestorAgent(),
        innovation: () => new InnovationAgent(),
    };

    getAgent(agent: AgentType): BaseAgent {
        const factory = this.agents[agent];

        if (!factory) {
            throw new Error(`Unknown agent type: ${agent}`);
        }

        return factory();
    }

    getAllAgentTypes(): AgentType[] {
        return Object.keys(this.agents) as AgentType[];
    }

}

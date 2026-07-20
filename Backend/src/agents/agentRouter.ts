import { BaseAgent } from "./Base.Agent";
import { StartupValidationAgent } from "./startup.agent";
import { MarketResearchAgent } from "./market.agent";
import { CompetitorAgent } from "./competitor.agent";
import { InvestorAgent } from "./investor.agent";
import { InnovationAgent } from "./innovation.agent";
import { CustomerPersonaAgent } from "./customerPersona.agent";
import { PricingAgent } from "./pricing.agent";
import { BusinessModelAgent } from "./businessModel.agent";
import { FinancialAgent } from "./financial.agent";
import { SWOTAgent } from "./swot.agent";
import { RiskAgent } from "./risk.agent";
import { GTMAgent } from "./gtm.agent";
import { TechnicalAgent } from "./technical.agent";
import { MarketingAgent } from "./marketing.agent";
import { RegulatoryAgent } from "./regulatory.agent";
import { AgentType } from "./agent.types";

export class AgentRouter {

    private agents: Record<AgentType, () => BaseAgent> = {
        startup: () => new StartupValidationAgent(),
        market: () => new MarketResearchAgent(),
        competitor: () => new CompetitorAgent(),
        investor: () => new InvestorAgent(),
        innovation: () => new InnovationAgent(),
        customerPersona: () => new CustomerPersonaAgent(),
        pricing: () => new PricingAgent(),
        businessModel: () => new BusinessModelAgent(),
        financial: () => new FinancialAgent(),
        swot: () => new SWOTAgent(),
        risk: () => new RiskAgent(),
        gtm: () => new GTMAgent(),
        technical: () => new TechnicalAgent(),
        marketing: () => new MarketingAgent(),
        regulatory: () => new RegulatoryAgent(),
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

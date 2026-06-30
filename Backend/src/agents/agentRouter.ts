import { StartupValidationAgent } from "./startupValidation.agent";
import { MarketResearchAgent } from "./marketResearch.agent";
import { CompetitorAgent } from "./competitor.agent";
import { InvestorAgent } from "./investor.agent";
import { RoadmapAgent } from "./roadmap.agent";
import { SWOTAgent } from "./swot.agent";
import { BusinessModelAgent } from "./businessModel.agent";
import { FinancialAgent } from "./financial.agent";
import { RiskAgent } from "./risk.agent";
import { AgentType } from "./agent.types";


export class AgentRouter {

    startup = new StartupValidationAgent();

    market = new MarketResearchAgent();

    competitor = new CompetitorAgent();

    investor = new InvestorAgent();

    roadmap = new RoadmapAgent();

    swot = new SWOTAgent();

    businessModel = new BusinessModelAgent();

    financial = new FinancialAgent();

    risk = new RiskAgent();

    getAgent(agent: AgentType) {

        switch(agent){

            case "startup":
                return new StartupValidationAgent();

            case "market":
                return new MarketResearchAgent();

            case "competitor":
                return new CompetitorAgent();

            case "investor":
                return new InvestorAgent();

            case "roadmap":
                return new RoadmapAgent();

            case "swot":
                return new SWOTAgent();

            case "business":
                return new BusinessModelAgent();

            case "financial":
                return new FinancialAgent();

            case "risk":
                return new RiskAgent();

        }

    }

}
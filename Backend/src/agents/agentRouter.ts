import { StartupValidationAgent } from "./startupValidation.agent";
import { MarketResearchAgent } from "./marketResearch.agent";
import { CompetitorAgent } from "./competitor.agent";
import { InvestorAgent } from "./investor.agent";
import { RoadmapAgent } from "./roadmap.agent";

export class AgentRouter {

    startup = new StartupValidationAgent();

    market = new MarketResearchAgent();

    competitor = new CompetitorAgent();

    investor = new InvestorAgent();

    roadmap = new RoadmapAgent();

    route(

        agent: string,

        message: string

    ) {

        switch(agent){

            case "startup":

                return this.startup.buildPrompt(message);

            case "market":

                return this.market.buildPrompt(message);

            case "competitor":

                return this.competitor.buildPrompt(message);

            case "investor":

                return this.investor.buildPrompt(message);

            case "roadmap":

                return this.roadmap.buildPrompt(message);

            default:

                return this.startup.buildPrompt(message);

        }

    }

}
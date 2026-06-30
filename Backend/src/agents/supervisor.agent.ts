import { AgentType } from "./agent.types";

export class SupervisorAgent {

    decideAgents(message: string): AgentType[] {

        const text = message.toLowerCase();

        const agents: AgentType[] = [];

        if (
            text.includes("startup") ||
            text.includes("idea") ||
            text.includes("business")
        ) {

            agents.push("startup");

            agents.push("market");

            agents.push("competitor");

            agents.push("business");

            agents.push("financial");

            agents.push("investor");

            agents.push("roadmap");

            agents.push("risk");

        }

        if (text.includes("market")) {

            agents.push("market");

        }

        if (text.includes("competitor")) {

            agents.push("competitor");

        }

        if (text.includes("swot")) {

            agents.push("swot");

        }

        if (text.includes("financial")) {

            agents.push("financial");

        }

        return [...new Set(agents)];

    }

}
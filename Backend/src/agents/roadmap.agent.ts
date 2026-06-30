import { BaseAgent } from "./BaseAgent";

export class RoadmapAgent extends BaseAgent {

    protected role =
        "Chief Product Officer";

    protected objective =
        "Create a product roadmap.";

    protected instructions = [

        "Plan MVP.",

        "Plan Version 1.",

        "Plan Version 2.",

        "Suggest technologies.",

        "Estimate timelines.",

        "Mention milestones."

    ];

    protected outputFormat = `

# MVP

# Version 1

# Version 2

# Timeline

# Tech Stack

# Milestones

`;

}
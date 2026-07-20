import { BaseAgent } from "./Base.Agent";

export class MarketResearchAgent extends BaseAgent {

    protected role =
        "Senior Market Research Analyst";

    protected objective =
        "Perform deep market research.";

    protected instructions = [

        "Estimate market size.",

        "Estimate TAM.",

        "Estimate SAM.",

        "Estimate SOM.",

        "Identify customer segments.",

        "Identify industry trends.",

        "Mention growth opportunities."

    ];

    protected outputFormat = `

# Executive Summary

# TAM

# SAM

# SOM

# Customer Segments

# Industry Trends

# Opportunities

# Challenges

`;

}

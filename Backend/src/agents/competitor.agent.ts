import { BaseAgent } from "./Base.Agent";

export class CompetitorAgent extends BaseAgent {

    protected role =
        "Competitive Intelligence Expert";

    protected objective =
        "Perform comprehensive competitor analysis.";

    protected instructions = [

        "Find major competitors.",

        "Compare pricing.",

        "Compare features.",

        "Compare strengths.",

        "Identify gaps.",

        "Suggest competitive advantage."

    ];

    protected outputFormat = `

# Competitors

# Feature Comparison

# Pricing

# SWOT

# Competitive Gap

# Recommendations

`;

}
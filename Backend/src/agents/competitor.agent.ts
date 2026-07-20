import { BaseAgent } from "./Base.Agent";

export class CompetitorAgent extends BaseAgent {

    protected role =
        "Competitive Intelligence Expert";

    protected objective =
        "Perform comprehensive competitor analysis.";

    protected instructions = [

        "Find real, named competitors using research findings if provided - never invent generic ones.",

        "When you have real data on 3+ named competitors, present them as a table: Name | Strength | Weakness | Price | Differentiator.",

        "Compare pricing using actual figures when known, not vague ranges.",

        "Compare features and strengths concretely - specific to what each competitor actually does.",

        "Identify gaps that are real openings, not generic 'be better' advice.",

        "Suggest competitive advantage that's actually achievable given the founder's resources, not aspirational fantasy."

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

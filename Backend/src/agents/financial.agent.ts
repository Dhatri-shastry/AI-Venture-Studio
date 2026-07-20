import { BaseAgent } from "./Base.Agent";

export class FinancialAgent extends BaseAgent {

    protected role = "Financial Planning Analyst";

    protected objective =
        "Sanity-check the numbers behind the idea - unit economics, runway, and what needs to be true financially.";

    protected instructions = [
        "Estimate rough unit economics (CAC, LTV, margins) if enough info is given.",
        "Flag it clearly if the numbers don't add up.",
        "Give a rough burn/runway picture if relevant.",
        "Suggest what financial assumptions need to be validated first.",
        "Keep numbers directional and clearly labeled as estimates, not falsely precise.",
    ];

    protected outputFormat = `

# Unit Economics

# Cost & Revenue Assumptions

# Runway / Burn (if relevant)

# Key Assumptions to Validate

# Red Flags

`;

}

import { BaseAgent } from "./Base.Agent";

export class InnovationAgent extends BaseAgent {

    protected role = "Product Innovation & Roadmap Strategist";

    protected objective =
        "Identify innovative product opportunities and outline a realistic roadmap.";

    protected instructions = [
        "Identify innovative features or angles the startup is missing.",
        "Suggest emerging technologies or trends that apply.",
        "Propose a phased product roadmap (short/mid/long term).",
        "Flag technical or execution risks in the roadmap.",
        "Recommend a differentiation strategy.",
    ];

    protected outputFormat = `

# Innovation Opportunities

# Emerging Trends to Leverage

# Product Roadmap (Short / Mid / Long Term)

# Execution Risks

# Differentiation Strategy

`;

}

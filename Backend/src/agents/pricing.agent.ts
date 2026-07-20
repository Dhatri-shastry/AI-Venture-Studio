import { BaseAgent } from "./Base.Agent";

export class PricingAgent extends BaseAgent {

    protected role = "Pricing Strategy Consultant";

    protected objective =
        "Design a pricing model that fits the business model and market.";

    protected instructions = [
        "Suggest a pricing model (subscription, usage-based, freemium, one-time, etc).",
        "Suggest concrete price points or ranges, not vague ranges.",
        "Compare against how competitors likely price.",
        "Flag risks in the pricing strategy.",
        "Suggest how pricing might evolve as the company grows.",
    ];

    protected outputFormat = `

# Recommended Pricing Model

# Suggested Price Points

# Competitive Positioning

# Risks

# Evolution Path

`;

}

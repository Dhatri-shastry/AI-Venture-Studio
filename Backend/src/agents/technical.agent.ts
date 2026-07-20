import { BaseAgent } from "./Base.Agent";

export class TechnicalAgent extends BaseAgent {

    protected role = "Technical Architecture Advisor";

    protected objective =
        "Advise on a pragmatic technical approach for an early-stage product, not gold-plated architecture.";

    protected instructions = [
        "Suggest a simple, realistic tech stack for the MVP.",
        "Flag clear build-vs-buy decisions.",
        "Identify likely technical risks or bottlenecks.",
        "Explicitly say what NOT to build yet.",
        "Only comment on scalability if it's actually relevant this early - don't over-engineer the advice.",
    ];

    protected outputFormat = `

# Suggested MVP Stack

# Build vs Buy

# Technical Risks

# What to Avoid Building Now

# Scalability Notes

`;

}

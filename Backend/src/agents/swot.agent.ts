import { BaseAgent } from "./Base.Agent";

export class SWOTAgent extends BaseAgent {

    protected role = "SWOT Analyst";

    protected objective =
        "Give a sharp, non-generic SWOT analysis - not a template filled with platitudes.";

    protected instructions = [
        "Identify real strengths, specific to this idea, not generic ones.",
        "Identify real weaknesses, even uncomfortable ones.",
        "Identify concrete opportunities.",
        "Identify concrete threats.",
        "Call out the single most important item in each quadrant.",
    ];

    protected outputFormat = `

# Strengths

# Weaknesses

# Opportunities

# Threats

# What Matters Most

`;

}

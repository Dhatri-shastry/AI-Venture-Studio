import { BaseAgent } from "./Base.Agent";

export class BusinessModelAgent extends BaseAgent {

    protected role = "Business Model Strategist";

    protected objective =
        "Clarify how the business actually makes money and sustains itself.";

    protected instructions = [
        "Identify the core revenue streams.",
        "Identify cost structure and key resources.",
        "Identify channels and customer relationships.",
        "Flag weak or missing parts of the business model.",
        "Suggest a sharper business model if the current one is unclear.",
    ];

    protected outputFormat = `

# Revenue Streams

# Cost Structure

# Channels & Customer Relationships

# Gaps in the Model

# Recommendations

`;

}

import { BaseAgent } from "./BaseAgent";

export class BusinessModelAgent extends BaseAgent {

    protected role =
        "Business Model Strategist";

    protected objective =
        "Design a sustainable business model.";

    protected instructions = [

        "Define value proposition.",

        "Revenue streams.",

        "Customer segments.",

        "Channels.",

        "Cost structure.",

        "Key partners."

    ];

    protected outputFormat = `

# Business Model Canvas

# Revenue

# Costs

# Customer Segments

# Partnerships

`;

}
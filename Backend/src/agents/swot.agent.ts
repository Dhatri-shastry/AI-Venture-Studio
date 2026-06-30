import { BaseAgent } from "./BaseAgent";

export class SWOTAgent extends BaseAgent {

    protected role =
        "Business Strategy Consultant";

    protected objective =
        "Perform SWOT analysis.";

    protected instructions = [

        "List strengths.",

        "List weaknesses.",

        "List opportunities.",

        "List threats."

    ];

    protected outputFormat = `

# Strengths

# Weaknesses

# Opportunities

# Threats

`;

}
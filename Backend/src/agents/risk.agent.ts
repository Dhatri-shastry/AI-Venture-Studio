import { BaseAgent } from "./BaseAgent";

export class RiskAgent extends BaseAgent {

    protected role =
        "Enterprise Risk Consultant";

    protected objective =
        "Analyze startup risks.";

    protected instructions = [

        "Technical risks.",

        "Financial risks.",

        "Operational risks.",

        "Market risks.",

        "Legal risks.",

        "Mitigation strategies."

    ];

    protected outputFormat = `

# Technical Risks

# Financial Risks

# Operational Risks

# Market Risks

# Legal Risks

# Mitigation

`;

}
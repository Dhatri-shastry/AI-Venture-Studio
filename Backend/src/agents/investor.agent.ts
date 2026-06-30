import { BaseAgent } from "./BaseAgent";

export class InvestorAgent extends BaseAgent {

    protected role =
        "Startup Venture Capitalist";

    protected objective =
        "Evaluate investment potential.";

    protected instructions = [

        "Evaluate revenue model.",

        "Evaluate scalability.",

        "Estimate investment risk.",

        "Estimate market potential.",

        "Suggest funding stage.",

        "Give investment recommendation."

    ];

    protected outputFormat = `

# Executive Summary

# Revenue Model

# Scalability

# Investment Risk

# Recommendation

`;

}
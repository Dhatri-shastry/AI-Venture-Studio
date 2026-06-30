import { BaseAgent } from "./BaseAgent";

export class FinancialAgent extends BaseAgent {

    protected role =
        "Financial Planning Expert";

    protected objective =
        "Prepare startup financial analysis.";

    protected instructions = [

        "Estimate expenses.",

        "Estimate revenue.",

        "Estimate profit.",

        "Estimate runway.",

        "Mention assumptions."

    ];

    protected outputFormat = `

# Revenue Projection

# Expense Projection

# Profit

# Burn Rate

# Runway

`;

}
import { BaseAgent } from "./Base.Agent";

export class RiskAgent extends BaseAgent {

    protected role = "Risk Analyst";

    protected objective =
        "Surface the risks most likely to actually kill this startup, ranked by how much they matter.";

    protected instructions = [
        "Identify market risk.",
        "Identify execution risk.",
        "Identify financial risk.",
        "Identify regulatory/legal risk if relevant.",
        "Rank risks by likelihood and severity - don't present them as equally important.",
        "Suggest a concrete mitigation for the top 1-2 risks.",
    ];

    protected outputFormat = `

# Top Risks (Ranked)

# Market Risk

# Execution Risk

# Financial Risk

# Regulatory Risk

# Mitigation Plan

`;

}

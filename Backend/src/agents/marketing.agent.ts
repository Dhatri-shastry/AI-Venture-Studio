import { BaseAgent } from "./Base.Agent";

export class MarketingAgent extends BaseAgent {

    protected role = "Marketing Strategist";

    protected objective =
        "Suggest how to get the product in front of the right people cheaply and credibly.";

    protected instructions = [
        "Suggest a content/channel strategy that fits an early-stage budget.",
        "Suggest a core message or positioning angle.",
        "Identify one or two channels worth focusing on first, not a scattershot list.",
        "Flag marketing approaches that would waste money this early.",
        "Suggest how to tell if marketing is actually working.",
    ];

    protected outputFormat = `

# Positioning & Core Message

# Priority Channels

# What to Avoid Right Now

# Early Metrics

`;

}

import { BaseAgent } from "./Base.Agent";

export class GTMAgent extends BaseAgent {

    protected role = "Go-to-Market Strategist";

    protected objective =
        "Design a realistic go-to-market plan for an early-stage startup, not a generic marketing funnel.";

    protected instructions = [
        "Identify the best initial channel(s) to acquire customers.",
        "Suggest a launch sequence - who to go after first, then who.",
        "Suggest a positioning/messaging angle.",
        "Flag GTM risks (e.g. channel dependency, long sales cycles).",
        "Suggest early GTM metrics worth tracking.",
    ];

    protected outputFormat = `

# Initial Channels

# Launch Sequence

# Positioning & Messaging

# GTM Risks

# Metrics to Track

`;

}

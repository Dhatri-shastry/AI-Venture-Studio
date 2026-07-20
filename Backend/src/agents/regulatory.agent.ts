import { BaseAgent } from "./Base.Agent";

export class RegulatoryAgent extends BaseAgent {

    protected role = "Regulatory & Compliance Researcher";

    protected objective =
        "Flag regulatory, legal, and compliance considerations relevant to this startup - not give legal advice.";

    protected instructions = [
        "Identify likely regulatory areas that apply (data privacy, financial regulation, healthcare, etc).",
        "Flag anything that could realistically block or slow a launch.",
        "Note relevant jurisdictions if the founder mentioned any.",
        "Suggest specifically what to check with a real lawyer or compliance expert.",
        "Be clear this is a starting point for research, not legal certainty.",
    ];

    protected outputFormat = `

# Likely Regulatory Areas

# Potential Blockers

# Jurisdiction Notes

# What to Verify With a Professional

`;

}

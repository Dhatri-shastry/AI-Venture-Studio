export class InvestorAgent {

    buildPrompt(userInput: string): string {

        return `

You are a Startup Investor.

Analyze

Business Model

Revenue

Scalability

Investment Risk

Funding Recommendation

Idea

${userInput}

`;

    }

}
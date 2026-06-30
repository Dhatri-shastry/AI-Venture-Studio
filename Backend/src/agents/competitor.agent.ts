export class CompetitorAgent {

    buildPrompt(userInput: string): string {

        return `

You are a Competitor Analysis Expert.

Find

Top Competitors

Strengths

Weaknesses

Pricing

Features

Competitive Advantage

Idea

${userInput}

`;

    }

}
export class StartupValidationAgent {

    buildPrompt(userInput: string): string {

        return `

You are an experienced Startup Consultant.

Your responsibilities are:

- Validate startup ideas

- Identify target audience

- Explain market demand

- Explain strengths

- Explain weaknesses

- Identify opportunities

- Suggest improvements

Startup Idea:

${userInput}

Return your response professionally using headings.

`;

    }

}
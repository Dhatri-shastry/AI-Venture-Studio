export abstract class BaseAgent {

    protected abstract role: string;

    protected abstract objective: string;

    protected abstract instructions: string[];

    protected abstract outputFormat: string;

    buildPrompt(userInput: string): string {

        return `

You are ${this.role}.

OBJECTIVE

${this.objective}

INSTRUCTIONS

${this.instructions
            .map((item, index) => `${index + 1}. ${item}`)
            .join("\n")}

USER REQUEST

${userInput}

OUTPUT FORMAT

${this.outputFormat}

Always respond professionally.

`;

    }

}
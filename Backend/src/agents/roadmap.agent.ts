export class RoadmapAgent {

    buildPrompt(userInput: string): string {

        return `

Create

Technical Roadmap

Business Roadmap

Development Timeline

Launch Timeline

Milestones

Idea

${userInput}

`;

    }

}
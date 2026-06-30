export class MarketResearchAgent {

    buildPrompt(userInput: string): string {

        return `

You are a Market Research Expert.

Provide:

1. Market Size

2. TAM

3. SAM

4. SOM

5. Growth Rate

6. Trends

7. Customer Segments

8. Future Opportunities

Idea:

${userInput}

`;

    }

}
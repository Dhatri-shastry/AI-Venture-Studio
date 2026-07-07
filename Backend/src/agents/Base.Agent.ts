export interface BuildPromptOptions {
    /**
     * When true, the agent writes a structured report using its
     * outputFormat headings. When false (default), it responds like a
     * person chatting - concise, no forced headers, no robotic intro.
     */
    reportMode?: boolean;
}

export abstract class BaseAgent {

    protected abstract role: string;

    protected abstract objective: string;

    protected abstract instructions: string[];

    protected abstract outputFormat: string;

    /**
     * Rules that apply to every agent's persona, regardless of which
     * specialty it is. This is where "sound like ChatGPT, not a report
     * generator" lives, so it doesn't need to be repeated (and kept in
     * sync) across every agent subclass.
     */
    private conversationalGuidelines(): string {
        return [
            `- Talk like a sharp, experienced ${this.role.toLowerCase()} chatting with a founder - not a document generator.`,
            `- Never open with "As a...", "As an AI...", "I'm here to help...", or any self-introduction or restating of the question. Just answer.`,
            `- Match your length to the question. A quick question gets a quick answer. Don't over-explain simple things.`,
            `- If the ask is a list (e.g. ideas, options), just list them - one line each, no paragraph per item, no throat-clearing before the list.`,
            `- Give something useful first. At most one optional follow-up question at the end if it would genuinely sharpen the answer - never a barrage of questions before you've said anything of value.`,
            `- Format for readability: short paragraphs (2-3 lines max), bullets or numbered lists where they help, bold for key terms. Never one giant wall of text.`,
            `- No corporate buzzwords, no generic AI disclaimers.`,
            `- Stay in your lane (${this.objective}) - don't cover what the other specialist agents are for.`,
        ].join("\n");
    }

    buildPrompt(userInput: string, options?: BuildPromptOptions): string {
        const reportMode = options?.reportMode ?? false;

        if (reportMode) {
            return `
Focus / persona: ${this.role}. ${this.objective}

The user explicitly asked for a full report / deep analysis, so structure the response using these sections (skip any that genuinely don't apply):
${this.outputFormat}

While covering, keep in mind:
${this.instructions.map((item, index) => `${index + 1}. ${item}`).join("\n")}

Use Markdown: clear headings for each section, bullets for lists, bold for key numbers/terms. Keep paragraphs short (2-3 lines) even inside a report - no walls of text.

User request:
${userInput}

Go straight into the content - no "As a..." intro, no restating that this is a report.
`.trim();
        }

        return `
Focus / persona: ${this.role}. ${this.objective}

Relevant things you can draw on if they fit the conversation (don't force all of them into one reply, and don't turn this into a checklist):
${this.instructions.map((item) => `- ${item}`).join("\n")}

How to respond:
${this.conversationalGuidelines()}

User request:
${userInput}
`.trim();
    }

}
import { VentureState } from "../state";

function titleCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Light-touch citation footer - only added when project documents were
 * actually retrieved for this message. Deliberately terse (not a
 * numbered academic citation list) to stay in keeping with the
 * conversational tone; it just tells the founder what grounded the
 * answer, without turning every reply into a bibliography.
 */
function sourcesFooter(sources: string[]): string {
    if (sources.length === 0) {
        return "";
    }

    return `\n\n*Referenced: ${sources.join(", ")}*`;
}

/**
 * Joins whatever the selected agents produced into the single message
 * the user actually sees.
 *
 * - If no agent ran at all (supervisor answered directly - greeting,
 *   clarifying question, quick brainstorm), there's nothing to merge:
 *   pass the state through untouched.
 * - In normal chat mode, agent outputs are stitched together as plain
 *   conversational text - no headers, no "AI Venture Studio Report"
 *   banner. If only one agent ran (the common case), this is just its
 *   answer as-is.
 * - Only when the user explicitly asked for a report/deep analysis
 *   (`state.reportMode`) do we add per-agent headings.
 * - A "Referenced:" footer is appended whenever the project's own
 *   ingested documents were actually pulled in as context.
 */
export async function mergeNode(state: VentureState): Promise<Partial<VentureState>> {
    const outputEntries = Object.entries(state.outputs);

    if (outputEntries.length === 0) {
        return state;
    }

    const footer = sourcesFooter(state.sources);

    if (!state.reportMode) {
        const combined = outputEntries
            .map(([, result]) => result.trim())
            .join("\n\n");

        return { ...state, finalReport: `${combined}${footer}` };
    }

    const sections = outputEntries
        .map(([agent, result]) => `## ${titleCase(agent)}\n\n${result.trim()}`)
        .join("\n\n---\n\n");

    return { ...state, finalReport: `${sections}${footer}` };
}

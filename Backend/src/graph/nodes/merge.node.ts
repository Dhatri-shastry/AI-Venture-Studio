import { VentureState } from "../state";

function titleCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
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
 */
export async function mergeNode(state: VentureState): Promise<Partial<VentureState>> {
    const outputEntries = Object.entries(state.outputs);

    if (outputEntries.length === 0) {
        return state;
    }

    if (!state.reportMode) {
        const combined = outputEntries
            .map(([, result]) => result.trim())
            .join("\n\n");

        return { ...state, finalReport: combined };
    }

    const sections = outputEntries
        .map(([agent, result]) => `## ${titleCase(agent)}\n\n${result.trim()}`)
        .join("\n\n---\n\n");

    return { ...state, finalReport: sections };
}
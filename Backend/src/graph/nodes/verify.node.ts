import { VentureState } from "../state";
import { LLMRouter } from "../../llm/router";

const router = new LLMRouter();

interface VerificationResult {
    passes: boolean;
    fixedAnswer: string;
}

function parseVerification(raw: string): VerificationResult | null {
    try {
        const cleaned = raw.replace(/```json|```/gi, "").trim();
        const parsed = JSON.parse(cleaned);
        return {
            passes: Boolean(parsed.passes),
            fixedAnswer: typeof parsed.fixedAnswer === "string" ? parsed.fixedAnswer.trim() : "",
        };
    } catch {
        return null;
    }
}

/**
 * The actual implementation of "the supervisor should ask itself: am I
 * actually answering the question, and is it grounded?" - this is a
 * dedicated accountability step, not a hope baked into the generation
 * prompt. Runs after merge (or synthesis for decision briefs are
 * skipped - see below), before save, and can REWRITE the final answer
 * if it fails its own check - not just flag it.
 *
 * Checks two things:
 *  1. Scope - does the answer actually address what was asked, without
 *     padding in irrelevant sections (the "competitor question shouldn't
 *     come back as a startup validation report" problem)?
 *  2. Grounding - does it claim research/statistics/named competitors
 *     that aren't actually backed by state.researchFindings? Does it
 *     fall back to generic placeholder examples (well-known brand names
 *     from training data) instead of saying data isn't available?
 *
 * Skipped for:
 *  - direct replies (greeting/brainstorm/clarify/redirect/simulation) -
 *    selectedAgents is empty, nothing to verify
 *  - decision briefs - synthesis.node.ts already does real cross-
 *    referencing across all specialist outputs; re-verifying a long
 *    synthesized document in one more call risks truncating or
 *    mangling it more than it helps, for a comparatively rare,
 *    already-expensive request type
 *
 * Fails open: if the verification call itself fails or returns
 * something unparseable, the original answer ships as-is rather than
 * blocking the response over a checker hiccup.
 */
export async function verifyNode(state: VentureState): Promise<Partial<VentureState>> {
    if (state.selectedAgents.length === 0 || state.decisionBrief || state.reportMode) {
    return {};
}

    if (!state.finalReport?.trim()) {
        return {};
    }

    try {
        const hasResearch = Boolean(state.researchFindings?.trim());
        const researchNote = hasResearch
            ? `Live research findings WERE available this turn:\n${state.researchFindings.trim()}`
            : `NO live research was run this turn - nothing in the answer should be presented as a researched or verified fact (real competitor names, current prices, market statistics). Estimates/reasoning are fine if labeled as such.`;

        const raw = await router.ask(
            state.provider,
            `A founder asked: "${state.message}"\n\n` +
            `Here's the draft answer:\n${state.finalReport.trim()}\n\n` +
            `${researchNote}\n\n` +
            `Check this draft against two things:\n` +
            `1. SCOPE: does it directly and primarily address what was actually asked, without padding in ` +
            `unrelated sections (e.g. a competitor question shouldn't come back mostly as generic startup ` +
            `validation)?\n` +
            `2. GROUNDING: does it claim "research found," cite statistics, or name specific real competitors/` +
            `businesses/prices/locations that aren't actually backed by the research findings above (or by what ` +
            `the founder themselves said)? Reused generic example brand names (the kind that show up in most ` +
            `AI answers about a given industry) count as a grounding failure too.\n\n` +
            `Respond with ONLY raw JSON, no markdown fences:\n` +
            `{"passes": true or false, "fixedAnswer": "if passes is false, a corrected version that fixes the ` +
            `scope/grounding problem while keeping everything that WAS good about the draft - same tone and ` +
            `formatting style. Empty string if passes is true."}`
        );

        const result = parseVerification(raw);

        if (result && !result.passes && result.fixedAnswer) {
            console.warn(`verifyNode: draft failed verification for "${state.message.slice(0, 60)}...", using corrected answer`);
            return { finalReport: result.fixedAnswer };
        }

        return {};
    } catch (error) {
        console.error("verifyNode: verification call failed, shipping the original answer", error);
        return {};
    }
}

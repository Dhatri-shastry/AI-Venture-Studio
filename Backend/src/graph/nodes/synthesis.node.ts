import { VentureState } from "../state";
import { LLMRouter } from "../../llm/router";

const router = new LLMRouter();

// Level 3 ("deep") - the exhaustive version. Every possible section,
// only produced when the founder explicitly asked for the full/complete
// picture (see promptintent.wantsFullReport).
const DEEP_STRUCTURE = `
# Executive Summary
# Market Validation
# Local Competitor Analysis
(use a Markdown table - Name | Strength | Weakness | Price | Differentiator - if there's real named-competitor data in the specialist findings below; otherwise say plainly what's not known)
# Customer Personas
# TAM / SAM / SOM
# Revenue Model
# Cost Estimate
# SWOT Analysis
# Hidden Risks
(ranked by how much they matter, not a flat list)
# Legal & Regulatory Considerations
# Investor Perspective
# Technical Feasibility
# Go-to-Market Strategy
# 90-Day Execution Roadmap
(concrete, dated-relative checklist - "Week 1-2: ...", not vague phases)
# Success Probability Score
(a number out of 100, with the 2-3 factors that actually drove it - and a confidence label: Verified / Estimated / Assumption for the score itself, since it's ultimately a judgment call, not a measured fact)
# Recommended Next Actions
(3-5 concrete things to do this week)
`.trim();

// Level 2 ("standard") - a genuine "should I do this" validation ask.
// Deliberately concise and decision-focused: NOT TAM/SAM/SOM, NOT a
// detailed revenue model, NOT customer personas, NOT a full SWOT -
// those only belong here if the founder explicitly asked for them
// (which would have already pushed depth to "deep" instead).
const STANDARD_STRUCTURE = `
# Executive Summary
(2-3 sentences, direct)
# Overall Verdict
(exactly one of: Build / Improve / Avoid - plus a single sentence on why)
# Confidence Score
(0-100, with the 1-2 factors that actually drove it)
# Why This Idea Works
- Market demand
- Customer problem
- Growth potential
# Challenges
- Competition
- Risks
- Execution difficulty
# Competitor Snapshot
(a compact Markdown table - Name | Strength | Weakness | Price | Differentiator - only if real competitor data exists in the findings below; otherwise say plainly what's not known rather than naming placeholder brands)
# Recommendation
- Should the founder continue, pivot, or stop?
- Suggested niche (if narrowing would help)
- Suggested differentiation
# Next Steps
(5-8 concrete, doable-soon actions - not generic advice)
`.trim();

/**
 * Runs after "merge", only doing real work when state.depth is
 * "standard" or "deep" (a no-op pass-through for the normal "summary"
 * case, which is most messages).
 *
 * The supervisor already routed the request to the right specialist
 * agents in parallel, and mergeNode already stitched their raw outputs
 * into state.finalReport. That's raw material, not the final answer:
 * this node makes one more LLM call that reads all of it plus live
 * research findings and actually SYNTHESIZES a single coherent
 * document - cross-referencing what the specialists found rather than
 * just stacking their outputs one after another - in whichever of the
 * two structures above matches the requested depth.
 */
export async function synthesisNode(state: VentureState): Promise<Partial<VentureState>> {
    const isDeep = state.decisionBrief || state.reportMode;

const structure = isDeep
    ? DEEP_STRUCTURE
    : STANDARD_STRUCTURE;

const label = state.decisionBrief
    ? "Decision Brief"
    : "Startup Validation Report";

    const specialistFindings = Object.entries(state.outputs)
        .map(([agent, output]) => `### ${agent}\n${output}`)
        .join("\n\n");

    const researchBlock = state.researchFindings?.trim()
        ? `\n\nLive research findings (real, current - draw on these directly, especially for competitor names/numbers):\n${state.researchFindings.trim()}`
        : "";

    const profileBlock = state.projectProfile?.trim()
        ? `\n\nWhat's known about this venture already (persistent project memory):\n${state.projectProfile.trim()}`
        : "";

    const scopeNote = isDeep
        ? ""
        : `\n\nThis is a concise Level 2 validation, NOT the exhaustive version - do NOT include TAM/SAM/SOM, ` +
          `detailed financial projections, customer personas, or a full SWOT breakdown unless the founder's ` +
          `message explicitly asked for one of those. Keep it decision-focused and scannable, not an exhaustive report.`;

    try {
        // Long-form synthesis prose - route to the writing capability,
        // trying the founder's own chosen provider first.
        const brief = await router.askForCapability(
            "writing",
            `A founder asked: "${state.message}"\n\n` +
            `You have raw analysis from a team of specialists below. Synthesize it into ONE coherent, ` +
            `well-organized ${label} - don't just concatenate their sections, actually cross-reference ` +
            `and reconcile what they found (e.g. if the market agent and the financial agent implied different ` +
            `things about scale, reconcile that rather than presenting both uncritically). Cut anything generic ` +
            `or repeated; keep everything specific to this founder's actual business.${profileBlock}${researchBlock}\n\n` +
            `Specialist findings:\n${specialistFindings}\n\n` +
            `Structure the brief with exactly these sections (skip a section only if truly nothing applies, ` +
            `and say so in one line rather than omitting it silently):\n${structure}${scopeNote}\n\n` +
            `Use Markdown headings matching the structure above, tables where specified, bold for key numbers. ` +
            `Default to INDIA and INR (₹) for every price/investment/revenue figure unless the founder's context ` +
            `clearly points elsewhere - never default to USD or US-only competitors as placeholders. ` +
            `Don't add a preamble before the first heading - go straight into the content.`,
            state.provider
        );

        return { finalReport: brief.trim() };
    } catch (error) {
        console.error("synthesisNode: synthesis call failed, falling back to the merged specialist outputs", error);
        // mergeNode already produced a reasonable (if less polished)
        // fallback in state.finalReport - leave it as-is rather than
        // failing the whole request over the synthesis step.
        return {};
    }
}

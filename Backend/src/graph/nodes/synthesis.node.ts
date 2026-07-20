import { VentureState } from "../state";
import { LLMRouter } from "../../llm/router";

const router = new LLMRouter();

const DECISION_BRIEF_STRUCTURE = `
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

/**
 * Runs after "merge", only doing real work when state.decisionBrief is
 * true (the founder asked something like "should I start this business"
 * - a genuine go/no-go validation question, not a routine chat message).
 * A no-op pass-through otherwise.
 *
 * The supervisor already routed a decision-brief request to every
 * relevant specialist agent in parallel (market, competitor, financial,
 * SWOT, risk, GTM, technical, investor, regulatory, etc), and mergeNode
 * already stitched their raw outputs into state.finalReport with
 * headers. That's NOT the final answer for a decision brief though -
 * it's raw material. This node makes one more LLM call that reads all
 * of it plus the live research findings, and actually SYNTHESIZES a
 * single coherent brief in a fixed, comprehensive structure - cross-
 * referencing what the specialists found rather than just stacking
 * their outputs one after another (which would repeat itself and read
 * like 12 separate documents rather than one).
 */
export async function synthesisNode(state: VentureState): Promise<Partial<VentureState>> {
    if (!state.decisionBrief) {
        return {};
    }

    const specialistFindings = Object.entries(state.outputs)
        .map(([agent, output]) => `### ${agent}\n${output}`)
        .join("\n\n");

    const researchBlock = state.researchFindings?.trim()
        ? `\n\nLive research findings (real, current - draw on these directly, especially for competitor names/numbers):\n${state.researchFindings.trim()}`
        : "";

    const profileBlock = state.projectProfile?.trim()
        ? `\n\nWhat's known about this venture already (persistent project memory):\n${state.projectProfile.trim()}`
        : "";

    try {
        const brief = await router.ask(
            state.provider,
            `A founder asked: "${state.message}"\n\n` +
            `You have raw analysis from a team of specialists below. Synthesize it into ONE coherent, ` +
            `well-organized Decision Brief - don't just concatenate their sections, actually cross-reference ` +
            `and reconcile what they found (e.g. if the market agent and the financial agent implied different ` +
            `things about scale, reconcile that rather than presenting both uncritically). Cut anything generic ` +
            `or repeated; keep everything specific to this founder's actual business.${profileBlock}${researchBlock}\n\n` +
            `Specialist findings:\n${specialistFindings}\n\n` +
            `Structure the brief with exactly these sections (skip a section only if truly nothing applies, ` +
            `and say so in one line rather than omitting it silently):\n${DECISION_BRIEF_STRUCTURE}\n\n` +
            `Use Markdown headings matching the structure above, tables where specified, bold for key numbers. ` +
            `Don't add a preamble before the Executive Summary - go straight into the content.`
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

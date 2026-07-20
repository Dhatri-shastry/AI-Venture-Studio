import Project from "../models/Project";
import { LLMRouter } from "../llm/router";

const router = new LLMRouter();
const MAX_PROFILE_CHARS = 4000;

/**
 * Keeps a project's persistent profile up to date after a substantive
 * exchange - merging what was just discussed into the existing summary
 * rather than replacing it, so facts established weeks ago (pricing
 * decided, competitors already researched, roadmap agreed on) survive
 * even though they're not part of the last 8 messages of chat history.
 *
 * Deliberately NOT awaited by its caller (save.node.ts) - this runs
 * fire-and-forget after the response has already been sent, since a
 * profile-maintenance LLM call has no business adding latency to the
 * answer the founder is waiting on. Errors are swallowed (logged only)
 * for the same reason: a failed background update should never surface
 * as a user-facing failure.
 */
export async function updateProjectProfile(
    projectId: string,
    provider: "gemini" | "groq" | "openrouter",
    userMessage: string,
    assistantReply: string
): Promise<void> {
    try {
        const project = await Project.findById(projectId).select("profile");

        if (!project) {
            return;
        }

        const existingProfile = project.profile || "(nothing recorded yet)";

        const updated = await router.ask(
            provider,
            `You maintain a running profile of a startup, used to give every future conversation full ` +
            `context without re-asking the founder. Update the profile below with anything new or changed ` +
            `from this exchange - keep everything still-true from before, overwrite anything that changed ` +
            `(e.g. pricing decided differently), and don't just append - integrate it into a clean, current ` +
            `summary. Cover whatever's known: the idea, target users, pricing, known competitors, business ` +
            `model, roadmap/milestones, key decisions made, and open questions. Keep it under ${MAX_PROFILE_CHARS} ` +
            `characters - prioritize what's still relevant, drop stale detail that's been superseded.\n\n` +
            `Current profile:\n${existingProfile}\n\n` +
            `New exchange:\nFounder: ${userMessage}\nAssistant: ${assistantReply}\n\n` +
            `Respond with ONLY the updated profile text - no preamble, no "Here's the updated profile:".`
        );

        project.profile = updated.trim().slice(0, MAX_PROFILE_CHARS);
        await project.save();
    } catch (error) {
        console.error("updateProjectProfile: failed (non-fatal, background task)", error);
    }
}

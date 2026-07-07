import { tool } from "@langchain/core/tools";
import { z } from "zod";
import Project from "../models/Project";
import Chat from "../models/Chat";

const schema = z.object({
    projectId: z.string().describe("The Mongo _id of the project to look up"),
});

/**
 * Lets an agent pull a project's stored profile (title, description,
 * status) plus a short slice of recent chat history, so it can ground
 * its answer in what's already known about this venture instead of
 * relying only on the current message.
 */
export const projectLookupTool = tool(
    async ({ projectId }: z.infer<typeof schema>) => {
        const project = await Project.findById(projectId).lean();

        if (!project) {
            return `No project found for id ${projectId}`;
        }

        const recentChats = await Chat.find({ projectId })
            .sort({ updatedAt: -1 })
            .limit(3)
            .lean();

        const chatSummaries = recentChats
            .map((c) => `- "${c.title}" (${c.messages?.length ?? 0} messages)`)
            .join("\n");

        return `Project: ${project.title}
Status: ${project.status}
Description: ${project.description || "(none)"}

Recent chats:
${chatSummaries || "(none yet)"}`;
    },
    {
        name: "project_lookup",
        description: "Fetches stored details and recent chat history for a project by its id.",
        schema,
    }
);

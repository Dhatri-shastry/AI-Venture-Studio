import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { retrieveContext } from "../rag/retrieval";

const schema = z.object({
    query: z.string().describe("What to search for in the project's ingested documents"),
    projectId: z.string().describe("The project to scope the search to"),
});

export const ragSearchTool = tool(
    async ({ query, projectId }: z.infer<typeof schema>) => {
        const { context, sources } = await retrieveContext(query, projectId);

        if (!context) {
            return "No relevant stored documents found for this project.";
        }

        return `${context}\n\n(Sources: ${sources.join(", ")})`;
    },
    {
        name: "search_project_documents",
        description:
            "Searches previously ingested research notes/documents for a project and returns the most relevant excerpts with their sources.",
        schema,
    }
);

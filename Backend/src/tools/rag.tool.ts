import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { retrieveContext } from "../rag/retrieval";

const schema = z.object({
    query: z.string().describe("What to search for in the project's ingested documents"),
    projectId: z.string().describe("The project to scope the search to"),
});

/**
 * Exposes the RAG retrieval step as an agent tool, so an agent can pull
 * relevant chunks from ingested research/notes on demand instead of only
 * getting context pre-injected by loadContext.node.ts.
 */
export const ragSearchTool = tool(
    async ({ query, projectId }: z.infer<typeof schema>) => {
        const context = await retrieveContext(query, projectId);
        return context || "No relevant stored documents found for this project.";
    },
    {
        name: "search_project_documents",
        description:
            "Searches previously ingested research notes/documents for a project and returns the most relevant excerpts.",
        schema,
    }
);

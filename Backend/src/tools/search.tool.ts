import { tool } from "@langchain/core/tools";
import { z } from "zod";

const schema = z.object({
    query: z.string().describe("The web search query"),
});

/**
 * Web search via Tavily (https://tavily.com), which is built for LLM
 * tool-use and returns clean summarized results rather than raw HTML.
 * Requires TAVILY_API_KEY. Fails soft with a clear message if unset,
 * rather than crashing whatever agent/tool-loop is calling it.
 */
export const searchTool = tool(
    async ({ query }: z.infer<typeof schema>) => {
        const apiKey = process.env.TAVILY_API_KEY;

        if (!apiKey) {
            return "Web search is not configured (missing TAVILY_API_KEY). Skipping live search.";
        }

        const res = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: apiKey,
                query,
                max_results: 5,
            }),
        });

        if (!res.ok) {
            return `Search failed (${res.status}): ${await res.text()}`;
        }

        const data = await res.json();

        const results = (data.results || [])
            .map((r: any, i: number) => `${i + 1}. ${r.title}\n${r.url}\n${r.content}`)
            .join("\n\n");

        return results || "No results found.";
    },
    {
        name: "web_search",
        description:
            "Searches the live web for current information (competitors, market news, pricing, etc). Use when the answer depends on up-to-date facts.",
        schema,
    }
);

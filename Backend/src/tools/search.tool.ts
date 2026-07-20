import { tool } from "@langchain/core/tools";
import { z } from "zod";

const schema = z.object({
    query: z.string().describe("The web search query"),
});

export async function runWebSearch(query: string): Promise<string> {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
        return "";
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
        console.error(`Tavily search failed (${res.status}): ${await res.text()}`);
        return "";
    }

    const data = await res.json();

    return (data.results || [])
        .map((r: any, i: number) => `${i + 1}. ${r.title} (${r.url})\n${r.content}`)
        .join("\n\n");
}

/**
 * Web search via Tavily (https://tavily.com), which is built for LLM
 * tool-use and returns clean summarized results rather than raw HTML.
 * Requires TAVILY_API_KEY. Fails soft with a clear message if unset,
 * rather than crashing whatever agent/tool-loop is calling it.
 *
 * This is the LangChain-tool wrapper (for future tool-calling agent
 * loops). The graph's own deep-research step (loadContext.node.ts) calls
 * `runWebSearch` directly instead, since it needs the raw result string
 * rather than a tool-call round trip.
 */
export const searchTool = tool(
    async ({ query }: z.infer<typeof schema>) => {
        const results = await runWebSearch(query);
        return results || "Web search returned nothing (or is not configured - missing TAVILY_API_KEY).";
    },
    {
        name: "web_search",
        description:
            "Searches the live web for current information (competitors, market news, pricing, etc). Use when the answer depends on up-to-date facts.",
        schema,
    }
);

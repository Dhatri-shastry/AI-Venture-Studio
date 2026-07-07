import { tool } from "@langchain/core/tools";
import { z } from "zod";

const schema = z.object({
    expression: z
        .string()
        .describe("A basic arithmetic expression, e.g. '(120000 * 0.15) / 12'"),
});

/**
 * Evaluates a basic arithmetic expression safely: only digits, decimal
 * points, parentheses, and + - * / % are allowed. No full JS eval, no
 * access to globals - deliberately limited so it's safe to hand to an
 * LLM as a tool.
 */
function safeEvaluate(expression: string): number {
    const sanitized = expression.trim();

    if (!/^[0-9+\-*/%.()\s]+$/.test(sanitized)) {
        throw new Error("Expression contains disallowed characters");
    }

    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${sanitized});`)();

    if (typeof result !== "number" || !Number.isFinite(result)) {
        throw new Error("Expression did not evaluate to a finite number");
    }

    return result;
}

export const calculatorTool = tool(
    async ({ expression }: z.infer<typeof schema>) => {
        try {
            const result = safeEvaluate(expression);
            return `${expression} = ${result}`;
        } catch (error) {
            return `Could not evaluate "${expression}": ${(error as Error).message}`;
        }
    },
    {
        name: "calculator",
        description:
            "Evaluates a basic arithmetic expression. Use for TAM/SAM/SOM math, revenue projections, unit economics, etc.",
        schema,
    }
);

import { AsyncLocalStorage } from "node:async_hooks";

/**
 * Per-request performance tracking. Uses AsyncLocalStorage so any node
 * deep in the LangGraph call chain (agents, research, synthesis...) can
 * record a timing without the tracker being threaded through every
 * function signature - including nodes that fan out and run in
 * parallel, since each gets its own async context.
 *
 * Usage:
 *   await runWithPerf(() => ventureGraph.invoke(state));   // wraps one request
 *   await timeStage("market", () => marketNode(state));    // records one stage
 *   logPerfSummary(chatId);                                // prints the breakdown
 */

export interface StageTiming {
    stage: string;
    ms: number;
}

class PerfContext {
    stages: StageTiming[] = [];
    requestStart = Date.now();
}

const als = new AsyncLocalStorage<PerfContext>();

/** Wraps a request so nested timeStage() calls have somewhere to record to. */
export function runWithPerf<T>(fn: () => Promise<T>): Promise<T> {
    return als.run(new PerfContext(), fn);
}

/** Times one stage (a graph node, an LLM call, a DB query...) and records it. */
export async function timeStage<T>(stage: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
        return await fn();
    } finally {
        const ctx = als.getStore();
        if (ctx) {
            ctx.stages.push({ stage, ms: Date.now() - start });
        }
    }
}

export function getPerfSummary(): { stages: StageTiming[]; totalMs: number } | null {
    const ctx = als.getStore();
    if (!ctx) return null;
    return { stages: ctx.stages, totalMs: Date.now() - ctx.requestStart };
}

/**
 * Logs the stage-by-stage breakdown for the current request. On by
 * default outside production; set PERF_LOGGING=true to force it on
 * (e.g. to debug a slow request in prod) or PERF_LOGGING=false to
 * force it off anywhere (e.g. noisy local dev).
 */
export function logPerfSummary(label = "request"): void {
    const forced = process.env.PERF_LOGGING;
    const shouldLog = forced === "true" || (forced !== "false" && process.env.NODE_ENV !== "production");

    const summary = getPerfSummary();
    if (!shouldLog || !summary) return;

    const width = Math.max(...summary.stages.map((s) => s.stage.length), 5);
    const lines = summary.stages
        .map((s) => `  ${s.stage.padEnd(width)}  ${s.ms}ms`)
        .join("\n");

    console.log(`\n[perf] ${label}\n${lines}\n  ${"TOTAL".padEnd(width)}  ${summary.totalMs}ms\n`);
}

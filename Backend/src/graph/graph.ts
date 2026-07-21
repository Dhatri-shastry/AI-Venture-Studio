import { StateGraph, START, END } from "@langchain/langgraph";

import { VentureStateAnnotation, VentureState } from "./state";
import { timeStage } from "../utils/perf";

import { loadContextNode } from "./nodes/loadContext.node";
import { supervisorNode } from "./nodes/supervisor.node";
import { researchNode } from "./nodes/research.node";
import { startupNode } from "./nodes/startup.node";
import { marketNode } from "./nodes/market.node";
import { competitorNode } from "./nodes/competitor.node";
import { investorNode } from "./nodes/investor.node";
import { innovationNode } from "./nodes/innovation.node";
import { customerPersonaNode } from "./nodes/customerPersona.node";
import { pricingNode } from "./nodes/pricing.node";
import { businessModelNode } from "./nodes/businessModel.node";
import { financialNode } from "./nodes/financial.node";
import { swotNode } from "./nodes/swot.node";
import { riskNode } from "./nodes/risk.node";
import { gtmNode } from "./nodes/gtm.node";
import { technicalNode } from "./nodes/technical.node";
import { marketingNode } from "./nodes/marketing.node";
import { regulatoryNode } from "./nodes/regulatory.node";
import { mergeNode } from "./nodes/merge.node";
import { synthesisNode } from "./nodes/synthesis.node";
import { verifyNode } from "./nodes/verify.node";
import { saveNode } from "./nodes/save.node";

import { AGENT_NODE_NAMES, routeAfterSupervisor, routeToSelectedAgents } from "./edges";

const builder = new StateGraph(VentureStateAnnotation);

// Wraps every node in timeStage() so per-stage performance logging (see
// utils/perf.ts) comes for free, without editing 20 individual node
// files. chat.controller.ts wraps the whole graph.invoke() call in
// runWithPerf() and logs the summary once the request finishes.
type NodeFn = (state: VentureState) => Promise<Partial<VentureState>>;
const timed = (name: string, fn: NodeFn): NodeFn => (state) => timeStage(name, () => fn(state));

const graph = builder
    .addNode("loadContext", timed("loadContext", loadContextNode))
    .addNode("supervisor", timed("supervisor", supervisorNode))
    .addNode("research", timed("research", researchNode))
    .addNode("startup", timed("startup", startupNode))
    .addNode("market", timed("market", marketNode))
    .addNode("competitor", timed("competitor", competitorNode))
    .addNode("investor", timed("investor", investorNode))
    .addNode("innovation", timed("innovation", innovationNode))
    .addNode("customerPersona", timed("customerPersona", customerPersonaNode))
    .addNode("pricing", timed("pricing", pricingNode))
    .addNode("businessModel", timed("businessModel", businessModelNode))
    .addNode("financial", timed("financial", financialNode))
    .addNode("swot", timed("swot", swotNode))
    .addNode("risk", timed("risk", riskNode))
    .addNode("gtm", timed("gtm", gtmNode))
    .addNode("technical", timed("technical", technicalNode))
    .addNode("marketing", timed("marketing", marketingNode))
    .addNode("regulatory", timed("regulatory", regulatoryNode))
    .addNode("merge", timed("merge", mergeNode))
    .addNode("synthesis", timed("synthesis", synthesisNode))
    .addNode("verify", timed("verify", verifyNode))
    .addNode("save", timed("save", saveNode));

graph
    .addEdge(START, "loadContext")
    .addEdge("loadContext", "supervisor")
    // Direct replies (greeting/clarify/off-topic redirect/brainstorm/
    // customer simulation) skip straight to merge; anything delegating
    // to agents goes through "research" first, which decides for itself
    // whether a live search is actually worth running.
    .addConditionalEdges("supervisor", routeAfterSupervisor, ["research", "merge"])
    .addConditionalEdges("research", routeToSelectedAgents, [...AGENT_NODE_NAMES]);

// Every agent branch rejoins at "merge" once it finishes.
for (const agentName of AGENT_NODE_NAMES) {
    graph.addEdge(agentName, "merge");
}

graph
    // synthesis is a no-op pass-through when state.depth is "summary"
    // (most messages); for "standard"/"deep" it replaces mergeNode's
    // simple concatenation with a real cross-referenced synthesis in
    // the structure matching that depth level.
    .addEdge("merge", "synthesis")
    // verify is the actual "am I answering the question, is this
    // grounded" accountability step - a no-op pass-through for direct
    // replies and decision briefs (see verify.node.ts), otherwise it can
    // rewrite finalReport if the draft fails its own scope/grounding check.
    .addEdge("synthesis", "verify")
    .addEdge("verify", "save")
    .addEdge("save", END);

export const ventureGraph = graph.compile();

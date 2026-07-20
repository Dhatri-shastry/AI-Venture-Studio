import { StateGraph, START, END } from "@langchain/langgraph";

import { VentureStateAnnotation } from "./state";

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
import { saveNode } from "./nodes/save.node";

import { AGENT_NODE_NAMES, routeAfterSupervisor, routeToSelectedAgents } from "./edges";

const builder = new StateGraph(VentureStateAnnotation);

const graph = builder
    .addNode("loadContext", loadContextNode)
    .addNode("supervisor", supervisorNode)
    .addNode("research", researchNode)
    .addNode("startup", startupNode)
    .addNode("market", marketNode)
    .addNode("competitor", competitorNode)
    .addNode("investor", investorNode)
    .addNode("innovation", innovationNode)
    .addNode("customerPersona", customerPersonaNode)
    .addNode("pricing", pricingNode)
    .addNode("businessModel", businessModelNode)
    .addNode("financial", financialNode)
    .addNode("swot", swotNode)
    .addNode("risk", riskNode)
    .addNode("gtm", gtmNode)
    .addNode("technical", technicalNode)
    .addNode("marketing", marketingNode)
    .addNode("regulatory", regulatoryNode)
    .addNode("merge", mergeNode)
    .addNode("synthesis", synthesisNode)
    .addNode("save", saveNode);

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
    // synthesis is a no-op pass-through unless state.decisionBrief is
    // true, in which case it replaces mergeNode's simple concatenation
    // with a real cross-referenced Decision Brief.
    .addEdge("merge", "synthesis")
    .addEdge("synthesis", "save")
    .addEdge("save", END);

export const ventureGraph = graph.compile();

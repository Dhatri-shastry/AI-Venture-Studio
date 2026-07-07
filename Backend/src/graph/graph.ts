import { StateGraph, START, END } from "@langchain/langgraph";

import { VentureStateAnnotation } from "./state";

import { loadContextNode } from "./nodes/loadContext.node";
import { supervisorNode } from "./nodes/supervisor.node";
import { startupNode } from "./nodes/startup.node";
import { marketNode } from "./nodes/market.node";
import { competitorNode } from "./nodes/competitor.node";
import { investorNode } from "./nodes/investor.node";
import { innovationNode } from "./nodes/innovation.node";
import { mergeNode } from "./nodes/merge.node";
import { saveNode } from "./nodes/save.node";

import { AGENT_NODE_NAMES, routeToSelectedAgents } from "./edges";

const builder = new StateGraph(VentureStateAnnotation);

const graph = builder
    .addNode("loadContext", loadContextNode)
    .addNode("supervisor", supervisorNode)
    .addNode("startup", startupNode)
    .addNode("market", marketNode)
    .addNode("competitor", competitorNode)
    .addNode("investor", investorNode)
    .addNode("innovation", innovationNode)
    .addNode("merge", mergeNode)
    .addNode("save", saveNode);

graph
    .addEdge(START, "loadContext")
    .addEdge("loadContext", "supervisor")
    // "merge" is included here so the supervisor can bypass every agent
    // when it already produced the reply itself (greeting / clarifying
    // question / quick brainstorm).
    .addConditionalEdges("supervisor", routeToSelectedAgents, [...AGENT_NODE_NAMES, "merge"]);

// Every agent branch rejoins at "merge" once it finishes.
for (const agentName of AGENT_NODE_NAMES) {
    graph.addEdge(agentName, "merge");
}

graph
    .addEdge("merge", "save")
    .addEdge("save", END);

export const ventureGraph = graph.compile();
import { StateGraph, START, END } from "@langchain/langgraph";

import { VentureState } from "./state";

import { supervisorNode } from "./nodes/supervisor.node";

import { startupNode } from "./nodes/startup.node";

import { mergeNode } from "./nodes/merge.node";

const builder = new StateGraph<VentureState>();

builder

.addNode(

    "supervisor",

    supervisorNode

)

.addNode(

    "startup",

    startupNode

)

.addNode(

    "merge",

    mergeNode

);

builder

.addEdge(

    START,

    "supervisor"

)

.addEdge(

    "supervisor",

    "startup"

)

.addEdge(

    "startup",

    "merge"

)

.addEdge(

    "merge",

    END

);

export const ventureGraph = builder.compile();
import { VentureState } from "../state";

export async function supervisorNode(

    state: VentureState

): Promise<VentureState> {

    const text = state.message.toLowerCase();

    const agents: string[] = [];

    if (

        text.includes("startup") ||

        text.includes("idea")

    ) {

        agents.push("startup");

    }

    if (

        text.includes("market")

    ) {

        agents.push("market");

    }

    if (

        text.includes("competitor")

    ) {

        agents.push("competitor");

    }

    return {

        ...state,

        selectedAgents: agents

    };

}
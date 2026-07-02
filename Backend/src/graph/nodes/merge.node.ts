import { VentureState } from "../state";

export async function mergeNode(

    state: VentureState

): Promise<VentureState>{

    let report = "# AI Venture Studio Report\n\n";

    Object.entries(state.outputs).forEach(

        ([agent,result])=>{

            report += `

## ${agent.toUpperCase()}

${result}

`;

        }

    );

    return{

        ...state,

        finalReport: report

    };

}
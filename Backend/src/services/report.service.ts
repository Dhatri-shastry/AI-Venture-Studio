export class ReportService {

    combine(results: string[]) {

        return `

# Venture Studio Analysis

${results.join("\n\n")}

`;

    }

}

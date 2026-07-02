import { GeminiProvider } from "./gemini";

export class LLMRouter {

    private gemini = new GeminiProvider();

    async ask(

        provider: string,

        prompt: string

    ): Promise<string> {

        switch(provider){

            case "gemini":

                return this.gemini.generate(prompt);

            default:

                throw new Error("Provider not supported");

        }

    }

}
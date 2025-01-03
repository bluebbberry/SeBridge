import * as Config from "../../src/configs/config.js";
import ollama from 'ollama'

export class LlmService {
    static llmService = new LlmService();

    async sparqlAnswerToNlAnswer(sparql) {
        if (Config.LLM_API_URL) {
            let prompt = "Turn the following SPARQL query-answer in a natural-language answer (also include links to the referenced linked data using data-uris): " + sparql;
            let answer = this.sendData(prompt);
            return answer;
        } else {
            return sparql;
        }
    }

    async sendData(prompt) {
        try {
            const response = await ollama.chat({
                model: 'llama3.1',
                messages: [{ role: 'user', content: prompt },],
            })
            console.log(response.message.content)
            return response.message.content;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

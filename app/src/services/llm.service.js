import ollama from 'ollama'

export class LlmService {
    static llmService = new LlmService();

    constructor() {
        this.ollamaIsAvailable = false;
        this.calculateWhetherOllamaAvailable();
    }

    async calculateWhetherOllamaAvailable() {
        try {
            await ollama.list();
            console.error("Ollama service is running.");
            this.ollamaIsAvailable = true;
        } catch (e) {
            console.error("Ollama service not available.");
            this.ollamaIsAvailable = false;
        }
    }

    async sparqlAnswerToNlAnswer(sparql) {
        if (this.ollamaIsAvailable) {
            let prompt = "On point and exact, with as few words as possible, describe the following SPARQL-formatted text to me: " + sparql;
            let answer = await this.sendData(prompt);
            return answer;
        } else {
            return null;
        }
    }

    async sendData(prompt) {
        try {
            const response = await ollama.chat({
                model: 'llama3.2',
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

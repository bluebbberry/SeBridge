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
            let prompt = "With as few words as possible, turn the following SPARQL-formatted text in a natural-language description: " + sparql;
            let answer = await this.sendData(prompt);
            return answer + " (Raw: " + sparql + ")";
        } else {
            return sparql;
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

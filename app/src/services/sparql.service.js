import * as Config from "../configs/config.js";

class SparqlService {
    static sparqlService = new SparqlService();

    sendDescribeQuery(resource) {
        const query = `DESCRIBE <${resource}>`;
        this.sendQuery(query);
    }

    async sendQuery(query) {
        // Configure the POST request
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/rdf+xml", // Choose your preferred format
        };

        const body = new URLSearchParams({
            query: query,
            format: "application/rdf+xml", // or JSON, Turtle, etc.
        });

        try {
            // Send the request using fetch
            const response = await fetch(Config.SPARQL_ENDPOINT, {
                method: "POST",
                headers: headers,
                body: body.toString(),
            });

            // Check for a successful response
            if (response.ok) {
                const result = await response.text();
                console.log("Query Result:");
                console.log(result); // Log the RDF/XML or response format
            } else {
                console.error(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error while sending query:", error);
        }
    }
}

export default SparqlService;

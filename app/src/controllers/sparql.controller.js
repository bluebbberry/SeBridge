import express from "express";
import SparqlService from "../services/sparql.service.js";

const router = express.Router();
const sparqlService = SparqlService.sparqlService;

// post update request to RDF triple store
router.post("/update", async (request, response) => {
    const updateQuery = request.body;
    const botResponse = await sparqlService.postUpdate(updateQuery);
    response.status(200).json({ responseBody: botResponse });
});

// post query to RDF triple store
router.post("/query", async (request, response) => {
    // support requests with Content-Type "application/x-www-form-urlencoded"
    // Variables are stored in request.body.<variable_name>
    const query = request.body.query;
    console.log("Received query");
    const botResponse = await sparqlService.postQuery(query);
    console.log("Bot response:");
    console.log(botResponse);
    response.status(200).json({ responseBody: JSON.parse(botResponse) });
});

export default router;

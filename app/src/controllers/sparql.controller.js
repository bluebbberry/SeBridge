import express from "express";
import SparqlService from "../services/sparql.service.js";

const router = express.Router();
const sparqlService = SparqlService.sparqlService;

// post update request to RDF triple store
router.post("/update", async (request, response) => {
    const updateQuery = request.body;
    const botResponse = await sparqlService.postQuery(updateQuery);
    response.status(200).json({ responseBody: botResponse });
});

// post query to RDF triple store
router.post("/query", async (request, response) => {
    const query = request.body;
    const botResponse = await sparqlService.postQuery(query);
    response.status(200).json({ responseBody: botResponse });
});

export default router;

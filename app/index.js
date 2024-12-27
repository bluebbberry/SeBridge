import express from 'express';
import cors from "cors";
import userController from "./src/controllers/user.controller.js";
import fungiController from "./src/controllers/fungi.controller.js";
import notificationsController from "./src/controllers/notifications.controller.js";
import {FungiHistoryService} from "./src/services/fungi-history.service.js";
import {MycelialFungiHistoryService} from "./src/services/mycelial-fungi-history.service.js";
import statusController from "./src/controllers/status.controller.js";
import * as Config from "./src/configs/config.js";
import SparqlService from "./src/services/sparql.service.js";
import {SemantiFedService} from "./src/services/semanti-fed.service.js";

// ============== REST API ===================
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Usage
const resource = "PREFIX dbo: <http://dbpedia.org/ontology/>\n" +
    "PREFIX dbp: <http://dbpedia.org/property/>\n" +
    "PREFIX dbr: <http://dbpedia.org/resource/>\n" +
    "\n" +
    "SELECT ?birthDate\n" +
    "WHERE {\n" +
    "    dbr:Albert_Einstein dbo:birthDate ?birthDate .\n" +
    "}\n" +
    "LIMIT 1";
await SparqlService.sparqlService.sendQuery(resource);

/*
app.use('/user', userController);
app.use('/fungi', fungiController);
app.use('/notifications', notificationsController);
app.use('/statuses', statusController);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});*/

SemantiFedService.semantiFedService.startLifecycle(Config.USER_ANSWERING_SCHEDULE);

/*
const fungiHistoryService = FungiHistoryService.fungiHistoryService;
fungiHistoryService.startUpdatingUserFeedback();

const mycelialHistoryService = MycelialFungiHistoryService.mycelialFungiHistoryService;
mycelialHistoryService.startAggregatingMycelialData();
*/

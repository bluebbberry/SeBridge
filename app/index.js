import express from 'express';
import cors from "cors";
import userController from "./src/controllers/user.controller.js";
import notificationsController from "./src/controllers/notifications.controller.js";
import statusController from "./src/controllers/status.controller.js";
import * as Config from "./src/configs/config.js";
import {SemanticWebBridgeService} from "./src/services/semanticWebBridge.service.js";
import sparqlController from "./src/controllers/sparql.controller.js";

// ============== REST API ===================
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/social/user', userController);
app.use('/social/notifications', notificationsController);
app.use('/social/statuses', statusController);
app.use('/semantic', sparqlController);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

SemanticWebBridgeService.semanticWebBridgeService.startLifecycle(Config.USER_ANSWERING_SCHEDULE);

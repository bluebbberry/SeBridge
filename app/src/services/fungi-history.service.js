import {FungiHistory} from "../model/FungiHistory.js";
import {StatusesService} from "./statuses.service.js";
import * as cron from "node-cron";
import {cronToHumanReadable} from "./post.util.service.js";
import * as Config from "../configs/config.js";

export class FungiHistoryService {
    static fungiHistoryService = new FungiHistoryService();

    constructor() {
        this.fungiHistory = new FungiHistory([]);
    }

    startUpdatingUserFeedback() {
        const checkForFeedbackSchedule = Config.FETCH_USER_FEEDBACK_SCHEDULE;
        cron.schedule(checkForFeedbackSchedule, () => {
            this.updateFungiHistoryBasedOnUserFeedback();
        });
        console.log("Scheduled checking user feedback " + cronToHumanReadable(checkForFeedbackSchedule));
    }

    updateFungiHistoryBasedOnUserFeedback() {
        this.fungiHistory.getFungiStates().forEach((fungiState) => {
            fungiState.setStatuses(fungiState.getStatuses().map(async (status) => {
                return await StatusesService.statusesService.getStatusById(status.id);
            }));
        });
    }

    getFungiHistory() {
        return this.fungiHistory;
    }
}

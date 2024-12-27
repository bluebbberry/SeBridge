import * as cron from "node-cron";
import { cronToHumanReadable, send, sendReply } from "./post.util.service.js";
import { getMentionsNotifications } from "./notifications.service.js";

export class SemantiFedService {
    static semantiFedService = new SemantiFedService();

    constructor(cronTemp = cron) {
        this.cron = cronTemp;
    }

    startLifecycle(answeringSchedule) {
        this.startAnsweringMentions(answeringSchedule);
    }

    startAnsweringMentions(answerSchedule) {
        this.checkForMentionsAndSendAnswer();
        this.cron.schedule(answerSchedule, () => {
            // 2. Answer Questions by users
            console.log("\n=== === === LIFECYCLE PHASE 2 - ANSWERING QUESTIONS BY USERS === === ===");
            this.checkForMentionsAndSendAnswer();
        });
        console.log("Scheduled fungi answering " + cronToHumanReadable(answerSchedule));
    }

    async checkForMentionsAndSendAnswer() {
        // check for mentions to account
        const mentions = await getMentionsNotifications();
        for (const mention of mentions) {
            const answer = "Hello test";
            await sendReply(answer, mention.status);
        }

        // check for requests under hashtag
        /*const postStatuses = await StatusesService.statusesService.getStatusesFromTag(Config.NUTRITIOUS_HASHTAG, 40);
        for (const status of postStatuses) {
            if (RuleParserService.parser.isAbleToReactTo(this.fungiState.getRuleSystem(), decode(status.content))) {
                const answer = this.generateAnswerToText(decode(status.content));
                await sendReply(answer, status);
            }
        }*/
    }
}

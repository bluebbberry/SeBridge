import * as cron from "node-cron";
import { cronToHumanReadable, sendReply } from "./post.util.service.js";
import {dismissNotification, getMentionsNotifications} from "./notifications.service.js";
import SparqlService from "./sparql.service.js";
import {JSDOM} from "jsdom";

export class SemanticWebBridgeService {
    static semanticWebBridgeService = new SemanticWebBridgeService();

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
            console.log("\n=== === === START ANSWERING QUESTIONS BY USERS === === ===");
            this.checkForMentionsAndSendAnswer();
        });
        console.log("Scheduled fungi answering " + cronToHumanReadable(answerSchedule));
    }

    async checkForMentionsAndSendAnswer() {
        // check for mentions to account
        const mentions = await getMentionsNotifications();
        for (const mention of mentions) {
            const plainText = this.removeMentions(this.extractPostContent(mention.status.content));
            let answer;
            if (!plainText.includes("INSERT")) {
                answer = await SparqlService.sparqlService.postQuery(plainText);
            } else {
                answer = await SparqlService.sparqlService.postUpdate(plainText);
            }
            const accountName = mention.status.account.acct;
            await sendReply("@" + accountName + " " + answer, mention.status);
            await dismissNotification(mention.id);
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

    extractPostContent(postHtml) {
        // Step 1: Parse the HTML string into a DOM object using DOMParser
        const dom = new JSDOM(postHtml);
        const doc = dom.window.document;

        // Step 2: Extract the raw text content of the post (without HTML tags)
        let content = doc.body.textContent || doc.body.innerText;

        // Step 3: Find all mentions (elements with class "mention")
        const mentions = doc.querySelectorAll('.mention');

        // Step 4: Replace mentions in the content with '@username'
        mentions.forEach(mention => {
            const username = mention.textContent || mention.innerText;
            content = content.replace(mention.outerHTML, '');
        });

        return content.trim(); // Return the sanitized content
    }

    removeMentions(post) {
        // Use a regular expression to remove mentions (e.g., @echo97)
        return post.replace(/@\w+/g, '').trim();
    }
}

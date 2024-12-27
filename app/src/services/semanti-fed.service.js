import * as cron from "node-cron";
import { cronToHumanReadable, send, sendReply } from "./post.util.service.js";
import { getMentionsNotifications } from "./notifications.service.js";
import SparqlService from "./sparql.service.js";
import {decode} from "html-entities";
import {JSDOM} from "jsdom";

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
        const query = "PREFIX dbo: <http://dbpedia.org/ontology/>\n" +
            "PREFIX dbp: <http://dbpedia.org/property/>\n" +
            "PREFIX dbr: <http://dbpedia.org/resource/>\n" +
            "\n" +
            "SELECT ?birthDate\n" +
            "WHERE {\n" +
            "    dbr:Albert_Einstein dbo:birthDate ?birthDate .\n" +
            "}\n" +
            "LIMIT 1";
        const mentions = await getMentionsNotifications();
        for (const mention of mentions) {
            const plainText = this.removeMentions(this.extractPostContent(mention.status.content));
            let answer;
            if (!plainText.includes("INSERT")) {
                answer = await SparqlService.sparqlService.postQuery(plainText);
            } else {
                answer = await SparqlService.sparqlService.postUpdate(plainText);
            }
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

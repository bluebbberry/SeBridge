import 'dotenv/config';

if (!process.env.URL || !process.env.MASTODON_API_KEY || !process.env.ACCOUNT_NAME) {
    console.error('Missing program arguments (pass through .env file: URL, MASTODON_API_KEY, ACCOUNT_NAME, MYCELIAL_HASHTAG)!');
    process.exit(1);
}

const URL = process.env.URL;
const MASTODON_API_KEY = process.env.MASTODON_API_KEY;
const ACCOUNT_NAME = process.env.ACCOUNT_NAME;
const SPARQL_ENDPOINT = process.env.SPARQL_ENDPOINT;

const USER_ANSWERING_SCHEDULE = process.env.USER_ANSWERING_SCHEDULE;

export {
    URL,
    ACCOUNT_NAME,
    MASTODON_API_KEY,
    USER_ANSWERING_SCHEDULE,
    SPARQL_ENDPOINT
};

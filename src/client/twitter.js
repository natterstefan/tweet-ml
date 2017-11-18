const Twitter = require('twitter');
const BigInteger = require('big-integer');

const client = new Twitter(
    {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    }
);

/**
 * 
 * @param {int} userId 
 * @param {string|null} sinceId 
 */
async function getUserData(userId, sinceId = null) {
    try {
        let parameters = {
            user_id: userId,
            count: 200
        };

        let tweets = [];
        if (sinceId) {
            sinceId = new BigInteger(sinceId);
            console.log("Fetch tweets since " + sinceId.toString());
            tweets = await getUserDataSince(parameters, sinceId);
        } else {
            console.log("Starting first import of tweets");
            tweets = await getUserDataFrom(parameters);

            // Change order of tweets to insert them chronologically
            tweets = tweets.reverse();
        }

        return tweets;
    } catch (e) {
        console.error(e);
    }

    return [];
}

/**
 * Fetches all tweets since the previous entry
 * @param {object} parameters 
 * @param {BigInteger} sinceId 
 */
async function getUserDataSince(parameters, sinceId) {
    parameters.since_id = sinceId.toString();

    let tweets = await client.get('statuses/user_timeline', parameters);

    // Return if no more tweets are found
    if (tweets.length === 0) {
        return tweets;
    }

    // Search new min_id
    let newMinId = new BigInteger(tweets[tweets.length - 1].id_str).add(1);

    console.log({ tweets: tweets.length, since_id: newMinId.toString() });

    return tweets.concat(await getUserDataSince(parameters, newMinId));
}

/**
 * Fetches all tweets before the max_id
 * @param {object} parameters 
 * @param {BigInteger} maxId 
 */
async function getUserDataFrom(parameters, maxId = null) {
    if (maxId) {
        parameters.max_id = maxId.toString();
    }

    let tweets = await client.get('statuses/user_timeline', parameters);

    // Return if no more tweets are found
    if (tweets.length === 0) {
        return tweets;
    }

    // Search new max_id
    let newMaxId = new BigInteger(tweets[tweets.length - 1].id_str).subtract(1);

    console.log({ tweets: tweets.length, max_id: newMaxId.toString() });

    return tweets.concat(await getUserDataFrom(parameters, newMaxId));
}

module.exports = {
    getUserData: getUserData
};
require('dotenv').config();

const TwitterClient = require('./client/twitter');
const Persistence = require('./persistence/persistence');

const connection = new Persistence();

async function start() {
    try {
        // Establish database connection
        await connection.connect();

        // Fetch last docuent from mongo
        let lastTweet = await connection.fetchLatestTweet();

        const userId = process.env.TWITTER_USER;
        let tweets = await TwitterClient.getUserData(userId, lastTweet ? lastTweet.id_str : null);

        console.log("Results: ", tweets.length);

        if (tweets.length > 0) {
            let result = await connection.insertTweets(tweets);
            console.log("Inserted " + result.result.n + " tweets");
        }

    } catch (e) {
        console.error(e);
    } finally {
        connection.disconnect();
    }
}

start().then(() => {
    console.log("Finished");
}).catch(e => {
    console.error(e);
});


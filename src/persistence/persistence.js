const { MongoClient } = require('mongodb');

class Persistence {

    constructor() {
        this.connection = null;
    }

    /**
     * Connect to mongodb
     */
    async connect() {
        this.connection = await MongoClient.connect(process.env.MONGO_DSN);

        console.log("Connection established");
    }

    /**
     * Returns the latest tweet
     */
    async fetchLatestTweet() {
        const collection = this.connection.collection('tweets_raw');

        let result = await collection.find({}).sort({ id: -1 }).limit(1).toArray();
        if (result.length > 0) {
            return result[0];
        }

        return null;
    }

    /**
     * Fetches all features
     */
    async fetchFeatures() {
        const collection = this.connection.collection('tweets_raw');

        let result = await collection.find({ retweeted_status: null })
            .sort({ retweet_count: -1 })
            .map(function (e) {
                return {
                    retweet_count: e.retweet_count,
                    text_length: e.text.length,
                    hashtags: e.entities.hashtags.length,
                    urls: e.entities.urls.length,
                    symbols: e.entities.symbols.length,
                    user_mentions: e.entities.user_mentions.length,
                    favourite_count: e.favorite_count,
                    lang: e.lang,
                    media: e.extended_entities && e.extended_entities.media ? e.extended_entities.media.length : 0
                };
            }).toArray();

        return result;
    }

    /**
     * Insert tweets
     * @param {array} tweets 
     * @return {object}
     */
    async insertTweets(tweets) {
        const collection = this.connection.collection('tweets_raw');

        return await collection.insertMany(tweets);
    }

    /**
     * Insert normalized data
     * @param {array} tweets 
     * @return {object}
     */
    async insertNormalizedData(tweets) {
        const collection = this.connection.collection('tweets_normalized');

        return await collection.insertMany(tweets);
    }

    /**
     * Disconnect the connection
     */
    disconnect() {
        if (!this.connection) {
            throw new Error("Connetion not established");
        }

        this.connection.close();
        this.connection = null;
    }
}

module.exports = Persistence;

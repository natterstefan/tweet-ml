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

        let result = await collection.find({}).sort({id:-1}).limit(1).toArray();
        if(result.length > 0) {
            return result[0];
        }

        return null;
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

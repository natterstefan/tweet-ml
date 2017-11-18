require('dotenv').config();

const { fetchTweets } = require('./controller/fetchTweets'),
    { normalizeTweets } = require('./controller/normalize');

if (process.argv.length <= 2) {
    throw new Error("Missing Argument. Please add arguments [fetch|normalize]");
}

switch (process.argv[2].toLowerCase()) {
    case 'fetch':
        startFetch();
        break;
    case 'normalize':
        startNormalize();
        break;
    default:
        throw new Error("Unknown mode. Please use arguments [fetch|normalize]");
}

function startFetch() {
    console.log("Starting fetching tweets");
    fetchTweets().then(() => {
        console.log("Fetched new tweets");
    }).catch(e => {
        console.error(e);
    });
}

function startNormalize() {
    console.log("Starting normalizing tweets");
    normalizeTweets().then(() => {
        console.log("Normalized existing tweets");
    }).catch(e => {
        console.error(e);
    });
}
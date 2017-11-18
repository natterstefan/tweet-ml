const Persistence = require('../persistence/persistence');
const connection = new Persistence();

async function normalizeTweets() {
    try {
        await connection.connect();

        let features = await connection.fetchFeatures();

        // Replace languages with values
        features = features.map((row) => {
            row.lang = (row.lang == 'de' ? 0 : 1);
            return row;
        });

        // For every property, create an array that contains all values of all properties
        // and normalize those values
        Object.keys(features[0]).forEach((key) => {
            let values = features.map((item) => (item[key]));

            normalizeData(values).forEach((value, i) => {
                features[i][key] = value;
            });
        });

        await connection.insertNormalizedData(features);

    } catch (e) {
        console.error(e);
    } finally {
        connection.disconnect();
    }
}

function normalizeData(data, min = -1.0, max = 1.0) {
    const minValue = Math.min.apply(null, data),
        maxValue = Math.max.apply(null, data),
        delta = maxValue - minValue;

    if (delta === 0) {
        return data;
    }

    const factor = (max - min) / delta;

    return data.map(entry => {
        return min + (entry - minValue) * factor;
    });
}

module.exports = {
    normalizeTweets: normalizeTweets
};
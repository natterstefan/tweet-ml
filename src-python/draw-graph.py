import os
from persistence import persistence;
from controller import graph;

MONGO_HOST=os.environ.get('MONGO_HOST')
MONGO_PORT=int(os.environ.get('MONGO_PORT'))
MONGO_DB=os.environ.get('MONGO_DB')


def draw_mosaic():
    """ Draws a mosaic for all normalized data """
    cursor = persistence.read_mongo(db=MONGO_DB, collection='tweets_normalized', host=MONGO_HOST, port=MONGO_PORT)
    dataframe = graph.create_dataframe(cursor)
    graph.create_mosaic(dataframe, "hashtags", "retweet_count", "Hashtags/RetweetCount")

def draw_boxplot(pipeline):
    """ Draws a boxplot filtering the results by the given mongo pipeline """
    cursor = persistence.aggregate_mongo(db=MONGO_DB, collection='tweets_raw', host=MONGO_HOST, port=MONGO_PORT, pipeline=pipeline)
    dataframe = graph.create_dataframe(cursor)
    graph.create_boxplot(dataframe)

def draw_was_retweeted_graph():
    """ Draws a graph to show correlation between retweets and hashtags """
    grouped_tweets = _group_retweeted_tweets(_get_retweeted_hashtags())
    
    graph.create_boxplot_from_arrays(grouped_tweets['yes'], grouped_tweets['no'], ['Yes', 'No'], xlabel='Retweeted?', ylabel='Hashtags', title='Retweeted vs Hashtags')

def _get_retweeted_hashtags():
    """ Returns retweet_count and number of hashtags for tweets """
    pipeline = [{"$project": {"_id": 1, "retweet_count": 1, "hashtags": {"$size": "$entities.hashtags"}}}]
    return persistence.aggregate_mongo(db=MONGO_DB, collection='tweets_raw', host=MONGO_HOST, port=MONGO_PORT, pipeline=pipeline)

def _group_retweeted_tweets(cursor):
    """ Groups all tweets by their retweet-status (yes, no) """
    result = {'yes': [], 'no': []}
    for document in cursor:
        if(document['retweet_count'] > 0):
            result['yes'].append(document['hashtags'])
        else:
            result['no'].append(document['hashtags'])
    return result

# Start drawing graphs
draw_was_retweeted_graph()
draw_boxplot(pipeline = [{"$project": {"_id": 1, "retweet_count": 1}}])
draw_boxplot(pipeline = [{"$project": {"_id": 1, "hashtags": {"$size": "$entities.hashtags"}}}])
draw_mosaic()
import os
from persistence import persistence;
from controller import graph;

MONGO_HOST=os.environ.get('MONGO_HOST')
MONGO_PORT=int(os.environ.get('MONGO_PORT'))
MONGO_DB=os.environ.get('MONGO_DB')


def draw_mosaic():
    cursor = persistence.read_mongo(db=MONGO_DB, collection='tweets_normalized', host=MONGO_HOST, port=MONGO_PORT)
    dataframe = graph.create_dataframe(cursor)
    graph.create_mosaic(dataframe, "hashtags", "retweet_count", "Hashtags/RetweetCount")

def draw_boxplot(pipeline):
    cursor = persistence.aggregate_mongo(db=MONGO_DB, collection='tweets_raw', host=MONGO_HOST, port=MONGO_PORT, pipeline=pipeline)
    dataframe = graph.create_dataframe(cursor)
    graph.create_boxplot(dataframe)

def draw_was_retweeted_graph():
    pipeline = [{"$project": {"_id": 1, "retweet_count": 1, "hashtags": {"$size": "$entities.hashtags"}}}]
    cursor = persistence.aggregate_mongo(db=MONGO_DB, collection='tweets_raw', host=MONGO_HOST, port=MONGO_PORT, pipeline=pipeline)
    
    result = {'yes': [], 'no': []}
    for document in cursor:
        if(document['retweet_count'] > 0):
            result['yes'].append(document['hashtags'])
        else:
            result['no'].append(document['hashtags'])

    graph.create_boxplot_from_arrays(result['yes'], result['no'], ['Yes', 'No'], xlabel='Retweeted?', ylabel='Hashtags', title='Retweeted vs Hashtags')

draw_was_retweeted_graph()
draw_boxplot(pipeline = [{"$project": {"_id": 1, "retweet_count": 1}}])
draw_boxplot(pipeline = [{"$project": {"_id": 1, "hashtags": {"$size": "$entities.hashtags"}}}])

draw_mosaic()
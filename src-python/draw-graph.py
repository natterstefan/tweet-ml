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


draw_boxplot(pipeline = [{"$project": {"_id": 1, "favorite_count": 1}}])
draw_boxplot(pipeline = [{"$project": {"_id": 1, "hashtags": {"$size": "$entities.hashtags"}}}])

draw_mosaic()
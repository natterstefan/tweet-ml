import pandas as pd
from statsmodels.graphics.mosaicplot import mosaic
from matplotlib import pylab

def create_dataframe(cursor, no_id=True):
    # Expand the cursor and construct the DataFrame
    df =  pd.DataFrame(list(cursor))

    # Delete the _id
    if no_id:
        del df['_id']

    return df

def create_mosaic(dataframe, col1, col2, title='Plot'):
    """ Best for categorical features (e.g. boolean values) """
    mosaic(dataframe, [col1, col2], title=title, gap=0.05, axes_label=True)
    pylab.show()


def create_boxplot(dataframe):
    """ Best for visualizing the distribution of a numerical variable """
    dataframe.boxplot()
    pylab.show()
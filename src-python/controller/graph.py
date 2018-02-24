import pandas as pd
from statsmodels.graphics.mosaicplot import mosaic
from matplotlib import pylab
from matplotlib import pyplot

def create_dataframe(cursor, no_id=True):
    # Expand the cursor and construct the DataFrame
    df =  pd.DataFrame(list(cursor))

    # Delete the _id
    if no_id:
        del df['_id']

    return df

def create_dataframe_from_dict(dict):
    return pd.DataFrame(dict)

def create_mosaic(dataframe, col1, col2, title='Plot'):
    """ Best for categorical features (e.g. boolean values) """
    mosaic(dataframe, [col1, col2], title=title, gap=0.05, axes_label=True)
    pylab.show()


def create_boxplot(dataframe):
    """ Best for visualizing the distribution of a numerical variable """
    dataframe.boxplot()
    pylab.show()

def create_boxplot_from_arrays(array1, array2, labels=None, title='Plot', xlabel='x', ylabel='y'):
    """ Create a boxplot from two arrays. Best for visualizing the distributon of a numerical variable """
    fig = pyplot.figure()
    fig.suptitle(title, fontsize=14, fontweight='bold')

    ax = fig.add_subplot(111)
    ax.boxplot([array1, array2], labels=labels)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    pyplot.show()


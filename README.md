# Tweet-ML

[![GitHub stars](https://img.shields.io/github/stars/natterstefan/tweet-ml.svg)](https://github.com/natterstefan/tweet-ml/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/natterstefan/tweet-ml.svg)](https://github.com/natterstefan/tweet-ml/network)
[![GitHub issues](https://img.shields.io/github/issues/natterstefan/tweet-ml.svg)](https://github.com/natterstefan/tweet-ml/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/natterstefan/tweet-ml.svg?style=social)](https://twitter.com/intent/tweet?text=https://github.com/natterstefan/tweet-ml)

Twitter Machine Learning Prototype

## Requirements

```
  node 8.9.x
  docker
```

## Setup

Clone the repository, use the required node version with `nvm use` and install
the packages with `npm i`.

## Configuration

Copy the [.env.dist](.env.dist) file and adjust the values according to your
setup.

```
  cp .env.dist .env
```

## Start

First start the Docker container with `docker-compose up` and then run either
the data fetching or normalisation script.

Example

```
  docker-compose up
  npm run fetch
```

## Scripts

- `npm run fetch`: gets the data from the defined userId (see [.env.dist](.env.dist))
  and stores them in the mongodb
- `npm run normalize`: normalises the data and stores them in the mongodb


## Authors

- [Philip Heimböck][pheimboeck] [![Twitter Follow philipheimboeck](https://img.shields.io/twitter/follow/pheimboeck.svg?style=social&label=Follow)](https://twitter.com/pheimboeck)
- [Stefan Natter][natterstefan] [![Twitter Follow natterstefan](https://img.shields.io/twitter/follow/natterstefan.svg?style=social&label=Follow)](https://twitter.com/natterstefan)

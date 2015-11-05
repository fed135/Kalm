# Kalm

NodeJS Framework specifically designed for micro-service architectures and minimal network overhead.

It has a very lean design with minimal noise, but is packed with powerful stuff like out-of the box socket management for tcp, udp and ipc. It's also very flexible, so you can load your own custom adapters for protocols like http or zmq.

It's perfect for network-intensive applications and games.

## Documentation

1. [Why](./docs/WHY.md)
1. [API Docs](./docs/API_DOCS.md)
1. [Roadmap](./docs/ROADMAP.md)
1. [Kalm coding rules](./docs/RULES.md)

## Installation

    npm install


## Run tests

    npm test


## Usage

    var Kalm = require('kalm');
    var myApp = new Kalm(config);

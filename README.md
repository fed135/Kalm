# Kalm

[![Kalm](https://img.shields.io/npm/v/kalm.svg)](https://www.npmjs.com/package/kalm)
[![Build Status](https://travis-ci.org/fed135/Kalm.svg?branch=master)](https://travis-ci.org/fed135/Kalm)
[![Code Climate](https://codeclimate.com/github/fed135/Kalm/badges/gpa.svg)](https://codeclimate.com/github/fed135/Kalm)

[![IPC Score](https://img.shields.io/badge/ipc_score-138537_rpm-green.svg)](./docs/PONG_TEST.md)
[![TCP Score](https://img.shields.io/badge/tcp_score-104578_rpm-green.svg)](./docs/PONG_TEST.md)
[![UDP Score](https://img.shields.io/badge/udp_score-291259_rpm-green.svg)](./docs/PONG_TEST.md)

NodeJS Framework specifically designed for micro-service architectures and minimal network overhead.

It has a very lean design with minimal noise, but is packed with powerful stuff like out-of the box socket management for tcp, udp and ipc. It's also very flexible, so you can load your own custom adapters for protocols like http or zmq.

It's perfect for network-intensive applications and games.

## Documentation

1. [Why](./docs/WHY.md)
1. [API Docs](https://github.com/fed135/Kalm-docs)
1. [Roadmap](./docs/ROADMAP.md)
1. [Kalm coding rules](./docs/RULES.md)

## Installation

    npm install


## Run tests

    npm test


## Usage

    var Kalm = require('kalm');
    var myApp = new Kalm(config);

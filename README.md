# Kalm

[![Kalm](https://img.shields.io/npm/v/kalm.svg)](https://www.npmjs.com/package/kalm)
[![Build Status](https://travis-ci.org/fed135/Kalm.svg?branch=master)](https://travis-ci.org/fed135/Kalm)
[![Code Climate](https://codeclimate.com/github/fed135/Kalm/badges/gpa.svg)](https://codeclimate.com/github/fed135/Kalm)

Kalm is a micro-services NodeJS Framework specifically designed for minimal network overhead and resiliance.

It has a very lean design with minimal noise, but is packed with powerful stuff like out-of the box socket management for tcp, udp web-sockets and [ipc](https://github.com/fed135/ipc-light). It's also very flexible, so you can load your own custom adapters for protocols like http or zmq.

You can choose how you communicate, wrapped stateless packets, or persistent stateful socket connections. It's perfect for network-intensive applications and games!


## The idea

Instead of separating your services in different processes, which is difficult to manage and maintain, Kalm proposes to regroup them all under a single cluster-ready process. This means that your entire application can live and be spread accross multiple machines, making it very resilient and portable.

You can use this [Template](https://github.com/fed135/Kalm-template) to get you started
All you need to do is to define your peers in the config and write your controllers.


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
    var myApp = Kalm.create(config, controllers);


## Roadmap

[Milestones](https://github.com/fed135/Kalm/milestones)

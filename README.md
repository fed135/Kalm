# Kalm

[![Kalm](https://img.shields.io/npm/v/kalm.svg)](https://www.npmjs.com/package/kalm)
[![Build Status](https://travis-ci.org/fed135/Kalm.svg?branch=master)](https://travis-ci.org/fed135/Kalm)
[![Code Climate](https://codeclimate.com/github/fed135/Kalm/badges/gpa.svg)](https://codeclimate.com/github/fed135/Kalm)

A batteries-included framework specifically designed to quickly setup low-latency services.

It has a business-oriented design with minimal noise (not a lot of dependencies), but is packed with powerful stuff like socket management for tcp, udp and ipc. It's also very flexible enough so that you can load your own custom adapters - say you wanted support for protocols like http, web-sockets or zmq.

## Getting started

A template application is available [here](https://github.com/fed135/Kalm-template). You can simply clone it and start playing around.


## Installation

    npm install


## Run tests

    npm test


## Debugging

By default, all Kalm logs are absorbed. They can be enabled through the DEBUG environement variable. They can after be piped to a file or remote server.

Ex:

    $ DEBUG=myApp:* > logs.txt


## Usage

    // Crude usage
    var Kalm = require('kalm');

    var config = {
        label: 'myApp',
        adapters: {
            ipc: { port: 4001 }
        },
        peers: {
            logger: {
                port: 4002
            }
        }
    };

    var myControllers = {
        log: function(body, reply) {
            console.log('peer ' + this.peer.label + ' recieved:';
            console.log(body);
            reply('gotcha');
        }
     };

    var myApp = new Kalm(config);

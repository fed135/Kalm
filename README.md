# Kalm

[![Kalm](https://img.shields.io/npm/v/kalm.svg)](https://www.npmjs.com/package/kalm)
[![Build Status](https://travis-ci.org/fed135/Kalm.svg?branch=master)](https://travis-ci.org/fed135/Kalm)
[![Code Climate](https://codeclimate.com/github/fed135/Kalm/badges/gpa.svg)](https://codeclimate.com/github/fed135/Kalm)
[![Dependencies status](https://david-dm.org/fed135/Kalm.svg)](https://www.npmjs.com/package/kalm)


[!!!Early Dev Stage!!!]

A library to simplify and optimize your Socket communications.

## Adapters

Allow you to easily use different socket types, hassle-free

| **Type** | **Library used** | **Status** |
|---|---|---|
| IPC |  | DEV |
| TCP |  | DEV |
| UDP |  | DEV |
| WebSocket | [socket.io](https://github.com/socketio/socket.io) | DEV |


## Encoders

Encode the payloads before emitting.

| **Type** | **Library used** | **Status** |
|---|---|---|
| JSON |  | PROD |
| MSG-PACK | [msgpack-lite](https://github.com/kawanet/msgpack-lite) | PROD |


## Middleware

Perform batch operation of payloads.

| **Type** | **Library used** | **Status** |
|---|---|---|
| Bundler |  | DEV |

---

The framework is flexible enough so that you can load your own custom adapters, encoders or middlewares - say you wanted support for protocols like zmq or yaml encoding.


## Usage

    var Kalm = require('Kalm');

    var client = new Kalm.Client({
      hostname: '0.0.0.0', // Some ip
      port: 3000, // Some port
      adapter: 'tcp',
      encoder: 'msg-pack',
      channels: {
        '/': function(data) {} // Handler
    });

    var server = new Kalm.Server({
      port: 6000,
      adapter: 'udp',
      encoder: 'json'
    });

    server.on('myEvent', function(data) {} // Handler

## Performance analysis

    // TODO
    

## Installation

    npm install kalm


## Run tests

    npm test


## Debugging

By default, all Kalm logs are absorbed. They can be enabled through the DEBUG environement variable. See [debug](https://github.com/visionmedia/debug) for more info.

Ex:

    $ DEBUG=kalm


## Roadmap

[Milestones](https://github.com/fed135/Kalm/milestones)

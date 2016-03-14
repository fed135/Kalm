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
| IPC |  | IN-DEV |
| TCP |  | - |
| UDP |  | - |


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
| Bundler |  | IN-DEV |

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
        'myEvent': function(data) {} // Handler
      }
    });

    client.send('myEvent', {foo: 'bar'});	// Can send Objects, Strings or Buffers 
    client.on('someOtherEvent', function() {}); // Can add other handlers dynamically 

    var server = new Kalm.Server({
      port: 6000,
      adapter: 'udp',
      encoder: 'json',
      channels: {
        'myEvent': function(data) {} // Handler - new connections will register to these events
      }
    });

    server.on('connection', function(client) {} // Handler, where client is an instance of Kalm.Client

    server.broadcast('someOtherEvent', 'hello!');


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

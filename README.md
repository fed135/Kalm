<img align="left" src="http://i231.photobucket.com/albums/ee109/FeD135/kalm_logo.png">
# Kalm
*The Socket Optimizer*

[![Kalm](https://img.shields.io/npm/v/kalm.svg)](https://www.npmjs.com/package/kalm)
[![Build Status](https://travis-ci.org/fed135/Kalm.svg?branch=master)](https://travis-ci.org/fed135/Kalm)
[![Code Climate](https://codeclimate.com/github/fed135/Kalm/badges/gpa.svg)](https://codeclimate.com/github/fed135/Kalm)
[![Dependencies Status](https://david-dm.org/fed135/Kalm.svg)](https://www.npmjs.com/package/kalm)
[![Current Stage](https://img.shields.io/badge/stage-alpha-blue.svg)](https://codeclimate.com/github/fed135/Kalm)

---

A library to simplify and optimize your Socket communications.

- Packet bundling
- Packet minification
- Easy-to-use single syntax for all protocols
- Channels for all protocols
- Plug-and-play
- Ultra-flexible and extensible


## Installation

    npm install kalm


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
    client.channel('someOtherEvent', function() {}); // Can add other handlers dynamically 

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

### Requests per minute

|  | IPC | TCP | UDP | Web Sockets |
|---|---|---|---|---|
| Raw  | 1332330 |  844750 | 822690 | - |
| Kalm | 5558920 | 1102570 | 5219490 | - |
| **Result** | +417.2% | +30.5% | +634.5% | - |

*Benchmarks based on a single-thread queue test with Kalm default bundling settings AND msg-pack enabled*

*5 run average*

### Bytes transfered

|  | IPC | TCP | UDP | WebSockets |
|---|---|---|---|---|
| Raw  | 81000 | 81000 | 57000 | - |
| Kalm | 6759 | 6759 | 8601 | - |
| **Result** | 11.9x less | 11.9x less | 6.6x less | - |

*Using wireshark - number of bytes transfered per 1000 requests*


## Adapters

Allow you to easily use different socket types, hassle-free

| **Type** | **Library used** | **Status** |
|---|---|---|
| IPC |  | STABLE |
| TCP |  | STABLE |
| UDP |  | STABLE |
| [kalm-websocket](https://github.com/fed135/kalm-websocket) | [socket.io](http://socket.io/) | DEV |


## Encoders

Encode the payloads before emitting.

| **Type** | **Library used** | **Status** |
|---|---|---|
| JSON |  | STABLE |
| MSG-PACK | [msgpack-lite](https://github.com/kawanet/msgpack-lite) | STABLE |


## Middleware

Perform batch operation of payloads.

| **Type** | **Library used** | **Status** |
|---|---|---|
| Bundler |  | STABLE |

---

The framework is flexible enough so that you can load your own custom adapters, encoders or middlewares - say you wanted support for protocols like zmq, WebSockets or have yaml encoding.


## Run tests

    npm test


## Debugging

By default, all Kalm logs are absorbed. They can be enabled through the DEBUG environement variable. See [debug](https://github.com/visionmedia/debug) for more info.

Ex:

    $ DEBUG=kalm


## Roadmap

[Milestones](https://github.com/fed135/Kalm/milestones)


## Contributing

I am looking for contributors to help improve the codebase and create adapters, encoders and middleware.
Email me for details.

Thank you!

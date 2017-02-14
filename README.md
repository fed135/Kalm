<img align="left" src="http://i231.photobucket.com/albums/ee109/FeD135/kalm_logo_bolded.png">
# Kalm
*The Socket Optimizer*

[![Kalm](https://img.shields.io/npm/v/kalm.svg)](https://www.npmjs.com/package/kalm)
[![Build Status](https://travis-ci.org/fed135/Kalm.svg?branch=master)](https://travis-ci.org/fed135/Kalm)
[![Dependencies Status](https://david-dm.org/fed135/Kalm.svg)](https://www.npmjs.com/package/kalm)
[![Gitter](https://img.shields.io/gitter/room/fed135/kalm.svg)](https://gitter.im/fed135/Kalm)

---

Simplify and optimize your Socket communications with:

- Easy-to-use single syntax for all protocols
- Configurable packet bundling (High-level Naggle's algorithm implementation)
- Multiplexing for all protocols
- Ultra-flexible and extensible, load your own adapters and encoders
- Can be used between servers or in the browser

---

## Compatibility

 * NODE >= 4.0.0


## Performance analysis

**Requests per minute**

<img src="http://i231.photobucket.com/albums/ee109/FeD135/perf_v140.png">

*Benchmarks based on a single-thread queue test with Kalm default bundling settings*

**Bytes transfered**

Bundled calls means that you only send the protocol headers (40 bytes + application overhead) once.
This makes a huge difference when you need to send a large number of small packets.

## Installation

    npm install kalm


## Usage

**Server**

```node
    const Kalm = require('kalm');

    // Create a server, listening for incoming connections
    let server = new Kalm.Server({
      port: 6000,
      adapter: 'udp',
      encoder: 'json',
      channels: {
        messageEvent: (data) => {               // Handler - new connections will register to these events
          console.log('User sent message ' + data.body);
        }
      }
    });

    // When a connection is received, send a message to all connected users
    server.on('connection', (client) => {    // Handler, where client is an instance of Kalm.Client
      server.broadcast('userEvent', 'A new user has connected');  
    });
    
```

**Client**

```node
    import Kalm from 'kalm';

    // Opens a connection to the server
    let client = new Kalm.Client({
      hostname: '0.0.0.0', // Server's IP
      port: 6000, // Server's port
      adapter: 'udp', // Server's adapter
      encoder: 'json', // Server's encoder
      channels: {
        'userEvent': (data) => {
          console.log('Server: ' + data);
        }
      }
    });

    client.send('messageEvent', {body: 'This is an object!'}); 
    client.subscribe('someOtherEvent', function() {});

```
## Documentation

[API docs](https://fed135.github.io/kalm.github.io)


## Adapters

- ipc (bundled)
- tcp (bundled)
- udp (bundled)
- [kalm-websocket](https://github.com/fed135/kalm-websocket)
- [kalm-webrtc](#) (On hold) 


## Encoders

- json (bundled)
- [kalm-msgpack](https://github.com/fed135/kalm-msgpack)
- [kalm-snappy](https://github.com/fed135/kalm-snappy)
- [kalm-compactr](#) (In-dev)


## Loading custom adapters

The framework is flexible enough so that you can load your own custom adapters, encoders or middlewares

```node
    // Custom adapter loading example
    const Kalm = require('kalm');
    const ws = require('kalm-websocket');
    const msgpack = require('kalm-msgpack');

    Kalm.adapters.register('ws', ws);
    Kalm.encoders.register('msg-pack', msgpack);

    let server = new Kalm.Server({
      port: 3000,
      adapter: 'ws',
      encoder: 'msg-pack'
    });
```


## Run tests

    npm test


## Logging

Kalm uses [debug](https://github.com/visionmedia/debug)

    export DEBUG=kalm

You can also gather optimization statistics by piping `kalm:stats`

    export DEBUG=kalm:stats myApp.js > stats.log


## Roadmap

[Version 2.0.0](https://github.com/fed135/Kalm/projects/2)


## Presentations

- [JS Montreal](http://www.meetup.com/js-montreal/events/224538913/) - June 14th 2016

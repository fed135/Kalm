<img align="left" src="http://i231.photobucket.com/albums/ee109/FeD135/kalm_logo.png">
# Kalm
*The Socket Optimizer*

[![Kalm](https://img.shields.io/npm/v/kalm.svg)](https://www.npmjs.com/package/kalm)
[![Build Status](https://travis-ci.org/fed135/Kalm.svg?branch=master)](https://travis-ci.org/fed135/Kalm)
[![Dependencies Status](https://david-dm.org/fed135/Kalm.svg)](https://www.npmjs.com/package/kalm)
[![Current Stage](https://img.shields.io/badge/stage-beta-blue.svg)](https://codeclimate.com/github/fed135/Kalm)

---

Simplify and optimize your Socket communications with:

- Packet bundling and minification
- Easy-to-use single syntax for all protocols
- Event channels for all protocols
- Ultra-flexible and extensible adapters

---


## Installation

    npm install kalm


## Usage

**Server**

```node
    var Kalm = require('Kalm');

    // Create a server, a listener for incomming connections
    var server = new Kalm.Server({
      port: 6000,
      adapter: 'udp',
      encoder: 'msg-pack',
      channels: {
        messageEvent: function(data) {               // Handler - new connections will register to these events
          console.log('User sent message ' + data.body);
        }
      }
    });

    // When a connection is received, send a message to all connected users
    server.on('connection', function(client) {    // Handler, where client is an instance of Kalm.Client
      server.broadcast('userEvent', 'A new user has connected');  
    });
    
```

**Client**

```node
    // Create a connection to the server
    var client = new Kalm.Client({
      hostname: '0.0.0.0', // Server's IP
      port: 6000, // Server's port
      adapter: 'udp', // Server's adapter
      encoder: 'msg-pack', // Server's encoder
      channels: {
        'userEvent': function(data) {
          console.log('Server: ' + data);
        }
      }
    });

    client.send('messageEvent', {body: 'This is an object!'});	// Can send Objects, Strings or Buffers 
    client.channel('someOtherEvent', function() {}); // Can add other handlers dynamically 

```

## Performance analysis

**Requests per minute**

<img src="http://i231.photobucket.com/albums/ee109/FeD135/perf.png">

*Benchmarks based on a single-thread queue test with Kalm default bundling settings AND msg-pack enabled*

**Bytes transfered**

<img src="http://i231.photobucket.com/albums/ee109/FeD135/transfered.png">

*Number of bytes transfered per 1000 requests*


## Adapters

Allow you to easily use different socket types, hassle-free

- ipc (bundled)
- tcp (bundled)
- udp (bundled)
- [kalm-websocket](https://github.com/fed135/kalm-websocket)


## Encoders

Encodes/Decodes the payloads

- json (bundled)
- msg-pack (bundled)


## Loading custom adapters

The framework is flexible enough so that you can load your own custom adapters, encoders or middlewares - say you wanted support for protocols like zmq, WebSockets or have yaml encoding.

```node
    // Custom adapter loading example
    var Kalm = require('Kalm');
    var MyCustomAdapter = require('my-custom-adapter');

    Kalm.adapters.register('my-custom-adapter', MyCustomAdapter);

    var server = new Kalm.Server({
      port: 3000,
      adapter: 'my-custom-adapter',
      encoder: 'msg-pack'
    });
```


## Run tests

    npm test


## Debugging

By default, all Kalm logs are hidden. They can be enabled through the DEBUG environement variable. See [debug](https://github.com/visionmedia/debug) for more info.

    export DEBUG=kalm


## Roadmap

[Milestones](https://github.com/fed135/Kalm/milestones)

- Fix ENOENT when multiple ipc clients attempt to connect to a server at once
- Reduce bottlenecks by analysing the flam graph
- Test offscoping controller calls


## Contributing

I am looking for contributors to help improve the codebase and create adapters, encoders and middleware.
Email me for details.

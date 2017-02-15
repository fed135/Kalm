<h1 align="center">
  <a title="The socket optimizer" href="http://kalm.js.org">
    <br/><br/><br/>
    <img alt="Kalm" src="http://res.cloudinary.com/kalm/image/upload/v1487196605/kalm.png" />
    <br/><br/><br/><br/>
  </a>
  Kalm
</h1>
<h3 align="center">*The Socket Optimizer*</h3>

[![Kalm](https://img.shields.io/npm/v/kalm.svg)](https://www.npmjs.com/package/kalm)
[![Build Status](https://travis-ci.org/fed135/Kalm.svg?branch=master)](https://travis-ci.org/fed135/Kalm)
[![Dependencies Status](https://david-dm.org/fed135/Kalm.svg)](https://www.npmjs.com/package/kalm)
[![Gitter](https://img.shields.io/gitter/room/fed135/kalm.svg)](https://gitter.im/fed135/Kalm)
[![Node](https://img.shields.io/badge/node->%3D4.0-blue.svg)](https://nodejs.org)

---

Simplify and optimize your Socket communications with:

- Easy-to-use single syntax for all protocols
- Configurable packet bundling (High-level Nagle's algorithm implementation)
- Multiplexing for all protocols
- Ultra-flexible and extensible, load your own transports and serializers
- Can be used between servers or in the browser

---


## Performance analysis

**Requests per minute**

<img src="http://i231.photobucket.com/albums/ee109/FeD135/perf_v140.png">

*Benchmarks based on a single-thread queue test with Kalm default bundling settings*

**Bytes transfered**

Call buffering can reduce payload sizes at the cost of some initial latency. 
This makes a huge difference when you need to send a large number of small packets, such as multiplayer games do. See [Nagle's algorithm](https://www.google.ca/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0ahUKEwjIxNrWk5PSAhWH14MKHaqkDEEQFggiMAE&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FNagle%27s_algorithm&usg=AFQjCNGydotOm34Q_mtojPHsoFsh32ZbFA&sig2=2yH5dyzeTT3V3xj1oczoxg).


## Usage

**Server**

```node
    const Kalm = require('kalm');

    // Listening for incoming UDP transactions on port 6000
    const server = Kalm.listen({
      port: 6000
    });

    server.on('connection', (client) => { //... });
    // Broadcast to all connections subscribed to the channel 'user.join'
    server.broadcast('user.join', { foo: 'bar' });
    // Subscribe to 'user.action' channel
    server.subscribe('user.action', (req) => {
      /*
        req.body       The body of the request
        req.client     The connection handle reference
        req.frame      The details of the network frame
        req.session    The session store for that connection
      */
    })
    
```

**Client**

```node
    import Kalm from 'kalm';

    // Opens a connection to the server
    // Port, transport and serial settings should match
    const client = Kalm.connect({
      hostname: '0.0.0.0', // Server's IP
      port: 6000 // Server's port
    });

    client.write('user.action', {body: 'This is an object!'}); 
    client.subscribe('user.join', () => { //... });

```
## Documentation

[API docs](https://fed135.github.io/kalm.github.io)


## Options

**Transports**
| --- | --- |
| IPC | `Kalm.transports.IPC` |
| TCP | `Kalm.transports.TCP` |
| UDP | `Kalm.transports.UDP` |
| WebSockets | [kalm-websocket](https://github.com/fed135/kalm-websocket) |

**Serializers**
| --- | --- |
| JSON | `Kalm.serials.JSON` |
| MSG-PACK | [kalm-msgpack](https://github.com/fed135/kalm-msgpack) |
| Snappy | [kalm-snappy](https://github.com/fed135/kalm-snappy) |

**Profiles**

| --- | --- | --- |
| dynamic | `Kalm.profiles.dynamic()` | Triggers based on buffer size and maximum time range (default) |
| heartbeat | `Kalm.profiles.heartbeat()` | Triggers at a fixed time interval | 
| threshold | `Kalm.profiles.threshold()` | Triggers when buffer reaches a certain size |
| manual | `Kalm.profiles.manual()` | Need to process queues by hand |


**Loading transports, profiles and serializers**

```node
    // Custom adapter loading example
    const Kalm = require('kalm');
    const ws = require('kalm-websocket');
    const msgpack = require('kalm-msgpack');

    const server = Kalm.listen({
      port: 3000,
      transport: ws,
      serial: msgpack,
      profile: Kalm.profiles.heartbeat({ step: 5 }) // Triggers every 5ms
    });
```


## Testing

**Unit + Smoke tests**

`npm test`

**Benchmarks**

`node tests/benchmarks`


## Logging

Kalm uses [debug](https://github.com/visionmedia/debug)

`export DEBUG=kalm`

You can also gather optimization statistics by piping `kalm:stats`

`export DEBUG=kalm:stats myApp.js > stats.log`
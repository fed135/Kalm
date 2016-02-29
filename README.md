# Kalm

[![Kalm](https://img.shields.io/npm/v/kalm.svg)](https://www.npmjs.com/package/kalm)
[![Build Status](https://travis-ci.org/fed135/Kalm.svg?branch=master)](https://travis-ci.org/fed135/Kalm)
[![Code Climate](https://codeclimate.com/github/fed135/Kalm/badges/gpa.svg)](https://codeclimate.com/github/fed135/Kalm)

[!!!Early Dev Stage!!!]

A library to simplify and optimize your Socket communications.

It includes a bunch of adapters:

- IPC [ipc-light](https://github.com/fed135/ipc-light)
- TCP
- UDP
- WebSocket [socket.io](https://github.com/socketio/socket.io)

It also includes encoders:

- JSON
- MSG-PACK [msgpack-lite](https://github.com/kawanet/msgpack-lite)

It's also flexible enough so that you can load your own custom adapters or encoders - say you wanted support for protocols like zmq or yaml.


## Usage

    // TODO


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

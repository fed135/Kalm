/**
 * InterProcessCall connector methods
 * @module adapters/ipc
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../../src/adapters/ipc');

/* Local variables -----------------------------------------------------------*/

const _path = '/tmp/app.socket-';

/* Tests ---------------------------------------------------------------------*/

/*
listen(server, callback) {}

stop(server, callback) {}

send(socket, payload) {}

createSocket(client, socket) {}

disconnect(client) {}
*/
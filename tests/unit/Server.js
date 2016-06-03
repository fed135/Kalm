/**
 * Server class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../src/Server');

/* Tests ---------------------------------------------------------------------*/
/*
	constructor(options={}) {
		super();

		this.id = crypto.randomBytes(20).toString('hex');

		this.listener = null;
		this._timer = null;

		this.options = {
			adapter: options.adapter || defaults.adapter,
			encoder: options.encoder || defaults.encoder,
			port: options.port || defaults.port,
			tick: defaults.tick,
			socketTimeout: options.socketTimeout || defaults.socketTimeout
		};

		this.connections = [];
		this.channels = options.channels || {};

		this.listen();
		this.setTick(this.options.tick);
	}

listen() {}

setTick(delay) {}

subscribe(name, handler, options) {}

unsubscribe(name, handler) {}

dump() {}

broadcast(channel, payload) {}

whisper(channel, payload) {}

stop(callback) {}

createClient(options, socket) {}

handleError(err) {}

handleRequest(socket) {}
*/
/**
 * Channel class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../src/Channel');

/* Tests ---------------------------------------------------------------------*/

/*
constructor(name, options, client) {
	this.id = crypto.randomBytes(20).toString('hex');
	this.name = name;
	this.options = options;

	this._client = client;
	this._emitter = client._emit.bind(client);

	this._timer = null;
	this.packets = [];
	this.handlers = [];

	this.splitBatches = true;

	// Bind to server tick 
	if (this.options.serverTick) {
		if (client.options.tick) {
			client.options.tick.on('step', this._emit);
		}
		else {
			debug('warn: no server heartbeat, ignoring serverTick config');
			this.options.serverTick = false;
		}
	}
}

send(payload) {}

sendOnce(payload) {}

startBundler() {}

resetBundler() {}

addHandler(method, bindOnce) {}

removeHandler(method) {}

destroy() {}

handleData(payload) {}
*/
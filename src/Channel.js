/**
 * Channel class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const debug = require('debug')('kalm');

const crypto = require('crypto');

/* Methods -------------------------------------------------------------------*/

class Channel {

	/**
	 * Channel constructor
	 * @param {Socket} socket An optionnal socket object to use for communication
	 * @param {object} options The configuration options for the client
	 */
	constructor(name, options, client) {
		this.id = crypto.randomBytes(20).toString('hex');
		this.name = name;
		this.options = options;

		this._client = client;
		this._emitter = client._emit.bind(client);

		this._timer = null;
		this.packets = [];
		this.handlers = [];

		this.splitBatches = options.splitBatches;

		// Bind to server tick 
		if (this.options.serverTick) {
			if (client.tick) {
				client.tick.on('step', this._emit.bind(this));
			}
			else {
				debug('warn: no server heartbeat, ignoring serverTick config');
				this.options.serverTick = false;
			}
		}
	}

	/**
	 * Tells the channel to process the payload to send
	 * @param {object|string} payload The payload to process
	 */
	send(payload) {
		this.packets.push(payload);

		// Bundling process
		if (this.packets.length >= this.options.maxPackets) {		
			this._emit();
			return;
		}

		this.startBundler();
	}

	/**
	 * Sends the latest payload only
	 * @param {object|string} payload The payload to send
	 */
	sendOnce(payload) {
		this.packets = [payload];

		this.startBundler();
	}

	/**
	 * Initializes the bundler timer
	 */
	startBundler() {
		if (!this.options.serverTick) {
			if (this._timer === null) {
				this._timer = setTimeout(this._emit.bind(this), this.options.delay);
			}
		}
	}

	/**
	 * Alerts the client to emit the packets for this channel
	 * @private
	 */
	_emit() {
		this._emitter(this.name, this.packets);
		this.packets.length = 0;
		this.resetBundler();
	}

	/**
	 * Clears the bundler timer
	 */
	resetBundler() {
		clearTimeout(this._timer);
		this._timer = null;
	}

	/**
	 * Adds a method that listens to this channel
	 * @param {function} method The method to bind
	 */
	addHandler(method, bindOnce) {
		this.handlers.push(method);
	}

	/**
	 * Removes a handler from this channel 
	 * @param {function} method The method to bind
	 */
	removeHandler(method) {
		let index = this.handlers.indexOf(method);
		if (index > -1) this.handlers.splice(index, 1);
	}

	/**
	 * Destroys the client and connection
	 */
	destroy() {
		this._client.destroy();
	}

	/**
	 * Handles channel data
	 * @param {array} payload The received payload
	 */
	handleData(payload) {
		let _reqs = payload.length;
		let _listeners = this.handlers.length;
		let reply = this.send.bind(this);
		let i;
		let c;

		if (this.splitBatches) {
			for (i = 0; i < _reqs; i++) {
				for (c = 0; c <_listeners; c++) {
					this.handlers[c](payload[i], reply, this);
				}
			}
		}
		else {
			for (c = 0; c < _listeners; c++) {
				this.handlers[c](payload, reply, this);
			}
		}
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Channel;
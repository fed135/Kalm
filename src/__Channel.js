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

		this.client = client;
		this._emitter = client._emit.bind(client);
		this._semitter = this._emit.bind(this);

		this._timer = null;
		this._bound = false;	// For serverTick
		this.packets = [];
		this.handlers = [];

		this.splitBatches = options.splitBatches;

		// Bind to server tick 
		if (this.options.serverTick) {
			if (client.tick) {
				debug('warn: no server heartbeat, ignoring serverTick config');
				this.options.serverTick = false;
			}
		}
	}

	/**
	 * Tells the channel to process the payload to send
	 * @param {object|string} payload The payload to process
	 * @param {boolean} once Wether to override other packets
	 */
	send(payload, once) {
		if (once) this.packets = [payload];
		else this.packets.push(payload);

		// Bundling process
		if (this.packets.length >= this.options.maxPackets) {		
			this._emit();
			return;
		}

		this.startBundler();
	}

	/**
	 * Initializes the bundler timer
	 */
	startBundler() {
		if (this.options.serverTick) {
			if (!this._bound) {
				this._bound = true;
				this.client.tick.once('step', this._semitter);
			}
		}
		else {
			if (!this._timer) {
				this._timer = setTimeout(this._semitter, this.options.delay);
			}
		}
	}

	/**
	 * Alerts the client to emit the packets for this channel
	 * @private
	 */
	_emit() {
		if (this.client.connected || this.client.fromServer) {
			while (this.packets.length !== 0) {
				this._emitter(this.name, this.packets.splice(0, this.options.maxPackets));
			}
		}

		this.resetBundler();
	}

	/**
	 * Clears the bundler timer
	 */
	resetBundler() {
		if (this.options.serverTick) {
			this._bound = false;
		}
		else {
			clearTimeout(this._timer);
			this._timer = null;
		}
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
		this.client.destroy();
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
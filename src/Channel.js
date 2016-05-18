/**
 * Channel class
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

class Channel {

	/**
	 * Channel constructor
	 * @param {Socket} socket An optionnal socket object to use for communication
	 * @param {object} options The configuration options for the client
	 */
	constructor(name, options, client) {
		this.name = name;
		this.options = options;

		this._client = client;
		this._emitter = client._emit.bind(client);

		this._timer = null;
		this._packets = [];
		this._handlers = [];

		this.splitBatches = true;
	}

	/**
	 * Tells the channel to process the payload to send
	 * @param {object|string} payload The payload to process
	 */
	send(payload) {
		this._packets.push(payload);

		// Bundling process
		if (this._packets.length >= this.options.maxPackets) {			
			this._emit();
			return;
		}

		this._startBundler();
	}

	/**
	 * Sends the latest payload only
	 * @param {object|string} payload The payload to send
	 */
	sendOnce(payload) {
		this._packets = [payload];

		this._startBundler();
	}

	/**
	 * Initializes the bundler timer
	 * @private
	 */
	_startBundler() {
		if (this._timer === null) {
			this._timer = setTimeout(this._emit.bind(this), this.options.delay);
		}
	}

	/**
	 * Alerts the client to emit the packets for this channel
	 * @private
	 */
	_emit() {
		this._emitter(this.name, this._packets);
		this._packets.length = 0;
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
		this._handlers.push(method);
	}

	/**
	 * Removes a handler from this channel 
	 * @param {function} method The method to bind
	 */
	removeHandler(method) {
		var index = this._handlers.indexOf(method);
		if (index > -1) this._handlers.splice(index, 1);
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
		var _reqs = payload.length;
		var _listeners = this._handlers.length;
		var reply = this.send.bind(this);
		var i;
		var c;

		if (this.splitBatches) {
			for (i = 0; i < _reqs; i++) {
				for (c = 0; c <_listeners; c++) {
					this._handlers[c](payload[i], reply, this);
				}
			}
		}
		else {
			for (c = 0; c < _listeners; c++) {
				this._handlers[c](payload, reply, this);
			}
		}
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Channel;
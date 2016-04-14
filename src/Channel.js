/**
 * Channel class
 * @class Channel
 * @exports {Channel}
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

/**
 * Channel constructor
 * @constructor
 * @param {Socket} socket An optionnal socket object to use for communication
 * @param {object} options The configuration options for the client
 */
function Channel(name, options, client) {
	this.name = name;
	this.options = options;

	this._client = client;
	this._emitter = client._emit.bind(client);

	this._timer = null;
	this._packets = [];
	this._handlers = [];
}

/**
 * Tells the channel to process the payload to send
 * @method send
 * @memberof Channel
 * @param {object|string} payload The payload to process
 */
Channel.prototype.send = function(payload) {
	this._packets.push(payload);

	// Bundling process
	if (this._packets.length >= this.options.maxPackets) {
		if (this._timer !== null) {
			clearTimeout(this._timer);
			this._timer = null;
		}
		
		this._emit();
		return;
	}

	if (this._timer === null) {
		this._timer = setTimeout(this._emit.bind(this), this.options.delay);
	}
};

/**
 * Alerts the client to emit the packets for this channel
 * @private
 * @method _emit
 * @memberof Channel
 */
Channel.prototype._emit = function() {
	this._emitter(this.name, this._packets);
	this._packets.length = 0;
};

/**
 * Adds a method that listens to this channel
 * @method addHandler
 * @memberof Channel
 * @param {function} method The method to bind
 */
Channel.prototype.addHandler = function(method) {
	this._handlers.push(method);
};

/**
 * Handles channel data
 * @method handleData
 * @memberof Channel
 * @param {array} payload The received payload
 */
Channel.prototype.handleData = function(payload) {
	var _reqs = payload.length;
	var _listeners = this._handlers.length;
	var i;
	var c;

	for (i = 0; i<_reqs; i++) {
		for (c = 0; c<_listeners; c++) {
			this._handlers[c](payload[i], this._client);
		}
	}
};

/* Exports -------------------------------------------------------------------*/

module.exports = Channel;
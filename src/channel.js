/**
 * Channel class
 * @class Channel
 * @exports {Channel}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var debug = require('debug')('kalm');

var Signal = require('signals');
var encoders = require('./encoders');

/* Methods -------------------------------------------------------------------*/

/**
 * Channel constructor
 * @constructor
 * @param {object} options The configuration options for the channel
 */
function Channel(name, peer) {
	this.label = name;
	this.peer = peer;

	this.adapter = null;
	this.client = null;

	this.onComplete = new Signal();
	this.onDisconnect = new Signal();

	// Bundling logic
	// -----------------------------
	// Add new calls to the bundle stack
	// If stack length exceeds limit OR
	// If time since last chunk sent is greater than the delay -
	// AND there is an item in the stack
	// Send.
	// If an item is added and delay timer is not started, start it. 
	this.bundles = [];
	this._bundleTimer = null;
	this.enableBundles = true;
}

/**
 * Destroys the channel instance
 * @method destroy
 * @memberof Channel
 */
Channel.prototype.destroy = function() {
	this.adapter.prototype.removeClient.call(this);
	this.onDisconnect.dispatch(this);
};

/**
 * Sends a packet through the channel
 * @method send
 * @memberof Channel
 * @param {string|object} payload The payload to send 
 */
Channel.prototype.send = function(payload) {
	if (this.enableBundles) {
		this.bundles.push(payload);
		if (this._bundleTimer === null) {
			this._bundleTimer = setTimeout(this._tick.bind(this), this.peer.options.bundleDelay);
		}
	}
	else {
		this.adapter.prototype.send.call(this, encoders[this.peer.options.encoder].encode(payload));
		this.onComplete.dispatch();
	}
};

/**
 * Send stacked bundles, prepare next flight
 * @private
 * @method _tick
 * @memberof Channel
 */
Channel.prototype._tick = function() {
	if (this.bundles.length > this.peer.options.maxBundle) {
		this._bundleTimer = setTimeout(this._tick.bind(this), this.peer.options.bundleDelay);
	}
	else {
		this._bundleTimer = null;
	}

	this.adapter.prototype.send.call(this, encoders[this.peer.options.encoder].encode(this.bundles.splice(0, this.peer.options.maxBundle)));
	this.onComplete.dispatch();
};

/**
 * Creates a channel for the channel
 * @method connect
 * @memberof Channel
 */
Channel.prototype.connect = function(adapter) {
	this.adapter = adapter;
	this.client = adapter.prototype.createClient.call(
		this,
		this.peer, 
		this.peer._handleRequest.bind(this.peer)
	);
};

/* Exports -------------------------------------------------------------------*/

module.exports = Channel;
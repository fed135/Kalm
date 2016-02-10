/**
 * Channel class
 * @class Channel
 * @exports {Channel}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Signal = require('signals');

/* Methods -------------------------------------------------------------------*/

/**
 * Channel constructor
 * @constructor
 * @param {object} options The configuration options for the channel
 */
function Channel(options) {
	this.label = options.channel || options.label;
	this.peer = options.peer;

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
	this.maxBundle = options.maxBundle || 100;	// Maybe put an hard limit ?
	this.bundleDelay = options.bundleDelay || (1000/128);
	this._bundleTimer = null;
	this.enableBundles = true;
}

/**
 * Destroys the channel instance
 * @method destroy
 * @memberof Channel
 */
Channel.prototype.destroy = function() {
	this.adapter.removeClient(this);
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
			this._bundleTimer = setTimeout(this._tick.bind(this), this.bundleDelay);
		}
	}
	else {
		this.adapter.send(payload);
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
	if (this.bundles.length > this.maxBundle) {
		this._bundleTimer = setTimeout(this._tick.bind(this), this.bundleDelay);
	}
	else {
		this._bundleTimer = null;
	}

	this.adapter.send(this.bundles.splice(0, this.maxBundle), this);
	this.onComplete.dispatch();
};

/**
 * Creates a channel for the channel
 * @method connect
 * @memberof Channel
 */
Channel.prototype.connect = function(adapter) {
	this.adapter = adapter;
	this.client = adapter.createClient(
		this.peer, 
		this, 
		this.peer.handlers[this.label]
	);
};

/* Exports -------------------------------------------------------------------*/

module.exports = Channel;
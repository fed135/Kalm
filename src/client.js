/**
 * Client class
 * @class Client
 * @exports {Client}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var debug = require('debug')('kalm');

var adapters = require('./adapters');
var encoders = require('./encoders');
var middleware = require('./middleware');

/* Methods -------------------------------------------------------------------*/

/**
 * Client constructor
 * @constructor
 * @param {object} options The configuration options for the client
 */
function Client(options) {
	options = options || {};

	this.options = {
		// Basic info
		hostname: options.hostname || '0.0.0.0',
		port: options.port || 80,
		// Adapter
		adapter: options.adapter || 'ipc',
		// Encoding
		encoder: options.encoder || 'json',
		// Transformations (middleware)
		transform: options.transform || {
			bundler: {
				maxPackets: 100,
				delay: (1000/128)
			}
		}
	};

	// List of channels 
	this._channels = options.channels || {};

	// Socket object
	this.socket = options.socket || null;

	// Data packets - transient state
	this._packets = [];

	// Init
	this._updateSocket();
}

/**
 * Recovers or create a channel for the client
 * @method channel
 * @memberof Client
 * @param {string|null} name The name of the channel.
 * @returns {Channel} The recovered or created channel
 */
Client.prototype.on = function(name, handler) {
	name = name || '/';

	if (name in this._channels) return;
	this._channels[name] = handler;
	debug('log: New Channel ' + name);

	this._updateSocket();
	return this;
};

Client.prototype.use = function(socket) {
	this.socket = socket;
	return this;
};

Client.prototype._updateSocket = function() {
	if (!this.socket) return;

	this.socket.on('data', this._handleRequest.bind(this));
	for (var i in this._channels) {
		this.socket.on(i, this._channels[i]);
	}
};

/**
 * Sends a packet through the channel
 * @method send
 * @memberof Channel
 * @param {string|object} payload The payload to send 
 */
Client.prototype.send = function(payload) {
	// Go through middlewares
	middleware.process(this, payload);
};

Client.prototype._emit = function(payload) {
	this.adapter.prototype.send(
		this.socket, 
		encoders[this.peer.options.encoder].encode(payload)
	);
}

Client.prototype._handleRequest = function(evt, data) {
	console.log('test');
	console.log(encoders[this.options.encoder].decode(evt || data));
};

/* Exports -------------------------------------------------------------------*/

module.exports = Client;
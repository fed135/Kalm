/**
 * Client class
 * @class Client
 * @exports {Client}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var debug = require('debug')('kalm');

var adapters = require('./adapters');
var encoders = require('./encoders');
var middleware = require('./middleware');

/* Methods -------------------------------------------------------------------*/

Client.UID = 0;

/**
 * Client constructor
 * @constructor
 * @param {object} options The configuration options for the client
 */
function Client(socket, options) {
	EventEmitter.call(this);
	
	this.uid = Client.UID++;

	if (options === undefined) {
		options = socket;
		socket = null;
	}
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
				maxPackets: 512,
				delay: 16
			}
		}
	};

	// List of channels 
	this.channels = {};
	// Populate channels
	if (options.channels) {
		for (var c in options.channels) {
			this.channel(c, options.channels[c]);
		}
	}

	// Socket object
	this.socket = this._createSocket(socket);

	// Data packets - transient state - by channel
	this.packets = {};
}

/**
 * Recovers or create a channel for the client
 * @method channel
 * @memberof Client
 * @param {string|null} name The name of the channel.
 * @returns {Channel} The recovered or created channel
 */
Client.prototype.channel = function(name, handler) {
	name = name || '/';

	if (name[0] !== '/') name = '/' + name;

	if (!(name in this.channels)) {
		debug(
			'log: new channel ' + 
			this.options.adapter + '://' + this.options.hostname + ':' + 
			this.options.port + name
		);
		this.channels[name] = [];
	}

	this.channels[name].push(handler);
	return this;
};

Client.prototype.use = function(socket) {
	this.socket = socket;
	return this;
};

/**
 * Sends a packet through the channel
 * @method send
 * @memberof Channel
 * @param {string|object} payload The payload to send 
 */
Client.prototype.send = function(channel, payload) {
	channel = channel || '/';
	if (!this.packets[channel]) this.packets[channel] = [];
	this.packets[channel].push(payload);
	// Go through middlewares
	middleware.process(this, channel, payload);
};

Client.prototype._createSocket = function(socket) {
	return adapters.resolve(this.options.adapter).createSocket(this, socket);
};

Client.prototype._emit = function(channel) {
	adapters.resolve(this.options.adapter).send(
		this.socket, 
		encoders.resolve(this.options.encoder).encode({
			c: channel,
			d: this.packets[channel]
		})
	);
	this.packets[channel].length = 0;
}

Client.prototype._handleRequest = function(evt) {
	var raw = encoders.resolve(this.options.encoder).decode(evt);
	if (raw.c[0] !== '/') raw.c = '/' + raw.c;

	if (raw.c in this.channels) {
		for (var i = 0; i<raw.d.length; i++) {
			for (var c = 0; c<this.channels[raw.c].length; c++) {
				this.channels[raw.c][c](raw.d[i]);
			}
		}
	}
};

util.inherits(Client, EventEmitter);

/* Exports -------------------------------------------------------------------*/

module.exports = Client;
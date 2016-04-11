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

var defaults = require('./defaults');
var adapters = require('./adapters');
var encoders = require('./encoders');
var middleware = require('./middleware');

/* Methods -------------------------------------------------------------------*/

Client.UID = 0;

/**
 * Client constructor
 * @constructor
 * @param {Socket} socket An optionnal socket object to use for communication
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
		hostname: options.hostname || defaults.hostname,
		port: options.port || defaults.port,
		// Adapter
		adapter: options.adapter || defaults.adapter,
		// Encoding
		encoder: options.encoder || defaults.encoder,
		// Transformations (middleware)
		transform: options.transform || defaults.transform
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
	this.use(socket);

	// Data packets - transient state - by channel
	this.packets = {};
}

/**
 * Creates a channel for the client
 * @method channel
 * @memberof Client
 * @param {string} name The name of the channel.
 * @param {function} handler The handler to add to the channel
 * @returns {Client} The client, for chaining
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

/**
 * Defines a socket to use for communication, disconnects previous connection
 * @method use
 * @memberof Client
 * @param {Socket} socket The socket to use
 * @returns {Client} The client, for chaining
 */
Client.prototype.use = function(socket) {
	if (this.socket) {
		debug('log: disconnecting current socket');
		adapters.resolve(this.options.adapter).disconnect(this.socket);
	}

	this.socket = this._createSocket(socket);
	return this;
};

/**
 * Queues a packet for transfer on the given channel
 * @method send
 * @memberof Client
 * @param {string} channel The channel to send to data through
 * @param {string|object} payload The payload to send 
 * @returns {Client} The client, for chaining
 */
Client.prototype.send = function(channel, payload) {
	channel = channel || '/';
	if (!this.packets.hasOwnProperty(channel)) this.packets[channel] = [];
	this.packets[channel].push(payload);
	// Go through middlewares
	middleware.process(this, this._emit.bind(this), channel, payload);

	return this;
};

/**
 * Creates or attaches a socket for the appropriate adapter
 * @private
 * @method _createSocket
 * @memberof Client
 * @param {Socket} socket The socket to use
 * @returns {Socket} The created or attached socket for the client
 */
Client.prototype._createSocket = function(socket) {
	return adapters.resolve(this.options.adapter).createSocket(this, socket);
};

/**
 * Sends a packet - triggered by middlewares
 * @private
 * @method _emit
 * @memberof Client
 * @param {string} channel The channel targeted for transfer
 */
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

/**
 * Handler for receiving data through the listener
 * @private
 * @method _handleRequest
 * @memberof Client
 * @param {Buffer} evt The data received
 */
Client.prototype._handleRequest = function(evt) {
	var raw = encoders.resolve(this.options.encoder).decode(evt);

	if (raw.c[0] !== '/') raw.c = '/' + raw.c;

	var i = 0;
	var c = 0;
	var _listeners = this.channels[raw.c].length;

	if (raw.c in this.channels) {
		for (var i = 0; i<raw.d.length; i++) {
			for (var c = 0; c<_listeners; c++) {
				this.channels[raw.c][c](raw.d[i]);
			}
		}
	}
};

util.inherits(Client, EventEmitter);

/* Exports -------------------------------------------------------------------*/

module.exports = Client;
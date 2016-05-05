/**
 * Client class
 * @class Client
 * @exports {Client}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;

const debug = require('debug')('kalm');

var defaults = require('./defaults');
var adapters = require('./adapters');
var encoders = require('./encoders');

var Channel = require('./Channel');

/* Methods -------------------------------------------------------------------*/

class Client extends EventEmitter{

	/**
	 * Client constructor
	 * @constructor
	 * @param {Socket} socket An optionnal socket object to use for communication
	 * @param {object} options The configuration options for the client
	 */
	constructor(socket, options) {
		super();
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
			bundler: options.bundler || defaults.bundler
		};

		// List of channels 
		this.channels = {};

		// Populate channels
		if (options.channels) {
			for (var c in options.channels) {
				this.subscribe(c, options.channels[c]);
			}
		}

		// Socket object
		this.socket = null;
		this.use(socket);
	}

	/**
	 * Creates a channel for the client
	 * @method subscribe
	 * @memberof Client
	 * @param {string} name The name of the channel.
	 * @param {function} handler The handler to add to the channel
	 * @returns {Client} The client, for chaining
	 */
	subscribe(name, handler) {
		name = name + '';	// Stringification

		if (!this.channels.hasOwnProperty(name)) {
			debug(
				'log: new channel ' + 
				this.options.adapter + '://' + this.options.hostname + ':' + 
				this.options.port + '/' + name
			);
			this.channels[name] = new Channel(
				name, 
				this.options.bundler, 
				this
			);
		}

		if (handler) {
			this.channels[name].addHandler(handler);
		}

		return this;
	}

	/**
	 * Removes a handler from a channel
	 * @method unsubscribe
	 * @memberof Client
	 * @param {string} name The name of the channel.
	 * @param {function} handler The handler to remove from the channel
	 * @returns {Client} The client, for chaining
	 */
	unsubscribe(name, handler) {
		name = name + '';	// Stringification

		if (!this.channels.hasOwnProperty(name)) return this;

		this.channels[name].removeHandler(handler);
		return this;
	}

	/**
	 * Defines a socket to use for communication, disconnects previous connection
	 * @method use
	 * @memberof Client
	 * @param {Socket} socket The socket to use
	 * @returns {Client} The client, for chaining
	 */
	use(socket) {
		if (this.socket) {
			debug('log: disconnecting current socket');
			adapters.resolve(this.options.adapter).disconnect(this);
		}

		this.socket = this.createSocket(socket);
		return this;
	}

	/**
	 * Socket error handler
	 * @method handleError
	 * @memberof Client
	 * @param {Error} err The socket triggered error
	 */
	handleError(err) {
		debug('error: ' + err);
		this.emit('error', err);
	}

	/**
	 * New socket connection handler
	 * @method handleConnect
	 * @memberof Client
	 * @param {Socket} socket The newly connected socket
	 */
	handleConnect(socket) {
		this.emit('connect', socket);
		this.emit('connection', socket);
	}

	/**
	 * Socket connection lost handler
	 * @method handleDisconnect
	 * @memberof Client
	 * @param {Socket} socket The disconnected socket
	 */
	handleDisconnect(socket) {
		this.emit('disconnect', socket);
		this.emit('disconnection', socket);
		this.socket = null;
	}

	/**
	 * Queues a packet for transfer on the given channel
	 * @method send
	 * @memberof Client
	 * @param {string} name The channel to send to data through
	 * @param {string|object} payload The payload to send 
	 * @returns {Client} The client, for chaining
	 */
	send(name, payload) {
		this.subscribe(name);
		
		this.channels[name].send(payload);
		return this;
	}

	/**
	 * Trumps other packets on the given channel, will only send the latest
	 * @method sendOnce
	 * @memberof Client
	 * @param {string} name The channel to send to data through
	 * @param {string|object} payload The payload to send 
	 * @returns {Client} The client, for chaining
	 */
	sendOnce(name, payload) {
		this.subscribe(name);
		
		this.channels[name].sendOnce(payload);
		return this;
	}

	/**
	 * Creates or attaches a socket for the appropriate adapter
	 * @private
	 * @method _createSocket
	 * @memberof Client
	 * @param {Socket} socket The socket to use
	 * @returns {Socket} The created or attached socket for the client
	 */
	createSocket(socket) {
		return adapters.resolve(this.options.adapter).createSocket(this, socket);
	}

	/**
	 * Sends a packet - triggered by middlewares
	 * @private
	 * @method _emit
	 * @memberof Client
	 * @param {string} channel The channel targeted for transfer
	 */
	_emit(channel, packets) {
		adapters.resolve(this.options.adapter).send(
			this.socket, 
			encoders.resolve(this.options.encoder).encode({
				c: channel,
				d: packets
			})
		);
	}

	/**
	 * Handler for receiving data through the listener
	 * @private
	 * @method handleRequest
	 * @memberof Client
	 * @param {Buffer} evt The data received
	 */
	handleRequest(evt) {
		var raw = encoders.resolve(this.options.encoder).decode(evt);

		if (raw && raw.c) {
			if (this.channels.hasOwnProperty(raw.c)) {
				this.channels[raw.c].handleData(raw.d);
			}
		}
	}

	/**
	 * Destroys the client and connection
	 * @method destroy
	 * @memberof Client
	 */
	destroy() {
		adapters.resolve(this.options.adapter).disconnect(this);
		this.socket = null;
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Client;
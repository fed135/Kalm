/**
 * Client class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

const debug = require('debug')('kalm');
const statsOut = require('debug')('kalm:stats');

var defaults = require('./defaults');
var adapters = require('./adapters');
var encoders = require('./encoders');

var Channel = require('./Channel');

/* Methods -------------------------------------------------------------------*/

class Client extends EventEmitter{

	/**
	 * Client constructor
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

		this.id = crypto.randomBytes(20).toString('hex');

		this.options = {
			// Basic info
			hostname: options.hostname || defaults.hostname,
			port: options.port || defaults.port,
			// Adapter
			adapter: options.adapter || defaults.adapter,
			// Encoding
			encoder: options.encoder || defaults.encoder,
			// Transformations (middleware)
			bundler: options.bundler || defaults.bundler,
			// Wether to output statistics in stdout
			stats: options.stats || defaults.stats
		};

		// List of channels 
		this.channels = {};
		
		// Server tick reference
		this.tick = options.tick || null;

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
	 * @param {string} name The name of the channel.
	 * @param {function} handler The handler to add to the channel
	 * @params {object} options The options object for the channel
	 * @returns {Client} The client, for chaining
	 */
	subscribe(name, handler, options) {
		name = name + '';	// Stringification
		options = options || {};

		if (!this.channels.hasOwnProperty(name)) {
			debug(
				'log: new connection ' + 
				this.options.adapter + '://' + this.options.hostname + ':' + 
				this.options.port + '/' + name
			);
			this.channels[name] = new Channel(
				name, 
				Object.assign(this.options.bundler, options),
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
	 * @param {Error} err The socket triggered error
	 */
	handleError(err) {
		debug('error: ' + err);
		this.emit('error', err);
	}

	/**
	 * New socket connection handler
	 * @param {Socket} socket The newly connected socket
	 */
	handleConnect(socket) {
		this.emit('connect', socket);
		this.emit('connection', socket);

		// In the case of a reconnection, we want to resume channel bundlers
		for (var channel in this.channels) {
			if (this.channels[channel].packets.length) {
				this.channels[channel].startBundler();
			}
		}
	}

	/**
	 * Socket connection lost handler
	 * @param {Socket} socket The disconnected socket
	 */
	handleDisconnect(socket) {
		this.emit('disconnect', socket);
		this.emit('disconnection', socket);
		this.socket = null;
	}

	/**
	 * Queues a packet for transfer on the given channel
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
	 * @param {Socket} socket The socket to use
	 * @returns {Socket} The created or attached socket for the client
	 */
	createSocket(socket) {
		return adapters.resolve(this.options.adapter).createSocket(this, socket);
	}

	/**
	 * Sends a packet - triggered by middlewares
	 * @private
	 * @param {string} channel The channel targeted for transfer
	 */
	_emit(channel, packets) {
		var payload = encoders.resolve(this.options.encoder).encode([
			channel,
			packets
		]);

		adapters.resolve(this.options.adapter).send(
			this.socket, 
			payload
		);

		if (this.options.stats) {
			statsOut(JSON.stringify({
				packets: packets.length, 
				bytes: payload.length 
			}));
		}
	}

	/**
	 * Handler for receiving data through the listener
	 * @private
	 * @param {Buffer} evt The data received
	 */
	handleRequest(evt) {
		var raw = encoders.resolve(this.options.encoder).decode(evt);

		if (raw && raw.length) {
			if (this.channels.hasOwnProperty(raw[0])) {
				this.channels[raw[0]].handleData(raw[1]);
			}
		}
	}

	/**
	 * Destroys the client and connection
	 */
	destroy() {
		adapters.resolve(this.options.adapter).disconnect(this);
		this.socket = null;
		for (var channel in this.channels) {
			this.channels[channel].resetBundler();
		}
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Client;
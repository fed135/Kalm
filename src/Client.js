/**
 * Client class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

// If running in the browser, do not load net adapters
const is_browser = (require('os').platform() === 'browser');

const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

const debug = require('debug')('kalm');
const statsOut = require('debug')('kalm:stats');

const defaults = require('./defaults');
const adapters = require('./adapters');
const encoders = require('./encoders');

const Channel = require('./Channel');

if (!is_browser) Promise = require('bluebird');

/* Methods -------------------------------------------------------------------*/

class Client extends EventEmitter{

	/**
	 * Client constructor
	 * @param {Socket} socket An optionnal socket object to use for communication
	 * @param {object} options The configuration options for the client
	 */
	constructor(options, socket) {
		super();
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
			bundler: Object.assign({}, defaults.bundler, options.bundler || {}),
			// Wether to output statistics in stdout
			stats: options.stats || defaults.stats,
			// Socket timeout
			socketTimeout: options.socketTimeout || defaults.socketTimeout,
			// Reject invalid communication attempts
			rejectForeign: options.rejectForeign || defaults.rejectForeign
		};

		// List of channels 
		this.channels = {};

		// Determines if the socket is server generated
		this.fromServer = (options.tick !== undefined);
		
		// Server tick reference
		this.tick = options.tick || null;

		// Populate channels
		if (options.channels) {
			Object.keys(options.channels).forEach((c) => {
				this.subscribe(c, options.channels[c])
			});
		}

		this.catch = options.catch || function() {};

		// Socket object
		this.socket = null;
		this.connected = false;
		this.use(socket);

		this.backlog = [];
	}

	/**
	 * Creates a channel for the client
	 * @param {string} name The name of the channel.
	 * @param {function} handler The handler to add to the channel
	 * @params {object} options The options object for the channel
	 * @returns {Client} The client, for chaining
	 */
	subscribe(name, handler, options) {
		options = options || {}
		name = name + '';	// Stringification

		if (!this.channels.hasOwnProperty(name)) {
			debug(
				'log: new ' + ((this.fromServer)?'server':'client') + ' connection ' +
				this.options.adapter + '://' + this.options.hostname + ':' +
				this.options.port + '/' + name
			);
			this.channels[name] = new Channel(
				name, 
				Object.assign({}, this.options.bundler, options),
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
		if (this.socket ) {
			this.destroy();
		}

		this.socket = this.createSocket(socket);
		return this;
	}

	/**
	 * Socket error handler
	 * @param {Error} err The socket triggered error
	 */
	handleError(err) {
		debug('error: ', err);
		this.emit('error', err);
	}

	/**
	 * New socket connection handler
	 * @param {Socket} socket The newly connected socket
	 */
	handleConnect(socket) {
		debug(
			'log: ' + ((this.fromServer)?'server':'client') + 
			' connection established'
		);
		this.connected = true;
		this.emit('connect', socket);
		this.emit('connection', socket);

		// In the case of a reconnection, we want to resume channel bundlers
		for (let channel in this.channels) {
			if (this.channels[channel].packets.length > 0) {
				this.channels[channel].startBundler();
			}
		}
	}

	/**
	 * Socket connection lost handler
	 */
	handleDisconnect() {
		debug(
			'warn: ' + ((this.fromServer)?'server':'client') + 
			' connection lost'
		);
		this.connected = false;
		this.emit('disconnect');
		this.emit('disconnection');
		this.socket = null;
	}

	/**
	 * Queues a packet for transfer on the given channel
	 * @param {string} name The channel to send to data through
	 * @param {string|object} payload The payload to send
	 * @param {boolean} once Wether to override packets with this one
	 * @returns {Client} The client, for chaining
	 */
	send(name, payload, once) {
		if (this.channels[name] === undefined) {
			this.subscribe(name);
		}
		this.channels[name].send(payload, once);
		return this;
	}

	/**
	 * Shortcut to send-once. This overrides other packets on the given channel
	 * @param {string} name The channel to send to data through
	 * @param {string|object} payload The payload to send 
	 * @returns {Client} The client, for chaining
	 */
	sendOnce(name, payload) {
		this.send(name, payload, true);
		return this;
	}

	/**
	 * Trumps other packets on the given channel, will only send the latest
	 * @param {string} name The channel to send to data through
	 * @param {string|object} payload The payload to send 
	 * @returns {Client} The client, for chaining
	 */
	sendNow(name, payload) {		
		this._emit(name, [payload]);
		return this;
	}

	/**
	 * Creates or attaches a socket for the appropriate adapter
	 * @param {Socket} socket The socket to use
	 * @returns {Socket} The created or attached socket for the client
	 */
	createSocket(socket) {
		return adapters.resolve(this.options.adapter)
			.createSocket(this, socket);
	}

	/**
	 * Sends a packet - triggered by middlewares
	 * @param {string} channel The channel targeted for transfer
	 */
	_emit(channel, packets) {
		const payload = encoders.resolve(this.options.encoder)
			.encode([channel, packets]);

		adapters.resolve(this.options.adapter)
			.send(this.socket, payload);

		if (this.options.stats) {
			statsOut(JSON.stringify({
				packets: packets.length, 
				bytes: payload.length
			}));
		}
	}

	/**
	 * Handler for receiving data through the listener
	 * Malformed or invalid payloads should result in a killing of the socket
	 * @param {Buffer} evt The data received
	 */
	handleRequest(evt) {
		if (evt.length <= 1) return;

		Promise.resolve()
			.then(() => {
				return encoders.resolve(this.options.encoder)
					.decode(evt);
			}, err => {
				this.handleError(err);
				this.destroy();
			})
			.then(raw => {
				if (raw && raw.length) {
					if (this.channels.hasOwnProperty(raw[0])) {
						this.channels[raw[0]].handleData(raw[1]);
						return;
					}
					else return this.catch(evt, this);
				}

				if (this.fromServer && this.options.rejectForeign) {
					this.handleError('malformed payload:'+ evt); // Error Class is too heavy
					this.destroy();
				}
			});
	}

	/**
	 * Destroys the client and connection
	 */
	destroy() {
		Promise.resolve()
			.then(() => {
				adapters.resolve(this.options.adapter).disconnect(this);
				this.socket = null;
			})
			.then(null, this.handleError.bind(this));
		
		for (let channel in this.channels) {
			if (this.channels.hasOwnProperty(channel)) {
				this.channels[channel].resetBundler();
			}
		}
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Client;
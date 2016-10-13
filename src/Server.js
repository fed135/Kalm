/**
 * Server class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

const debug = require('debug')('kalm');

const defaults = require('./defaults');
const Client = require('./Client');
const Timer = require('./Timer');
const adapters = require('./adapters');

/* Methods -------------------------------------------------------------------*/

class Server extends EventEmitter {

	/**
	 * Server constructor
	 * @param {object} options The configuration options for the server
	 */
	constructor(options) {
		super();
		options = options || {};

		this.id = crypto.randomBytes(20).toString('hex');

		this.listener = null;
		this._timer = null;

		this.options = {
			adapter: options.adapter || defaults.adapter,
			encoder: options.encoder || defaults.encoder,
			port: options.port || defaults.port,
			tick: options.tick || defaults.tick,
			socketTimeout: options.socketTimeout || defaults.socketTimeout,
			rejectForeign: options.rejectForeign || defaults.rejectForeign
		};

		this.connections = [];
		this.channels = {};
		this.catch = options.catch || function() {};

		if (options.channels) {
			Object.keys(options.channels).forEach(c => {
				this.subscribe(c, options.channels[c])
			});
		}

		this.listen();
		this.setTick(this.options.tick);
	}

	/**
	 * Server lift method
	 */
	listen() {
		debug(
			'log: listening ' + 
			this.options.adapter + 
			'://0.0.0.0:' + 
			this.options.port
		);
			
		Promise.resolve()
			.then(() => {
				adapters.resolve(this.options.adapter).listen(this, () => {
					process.nextTick(() => {
						this.emit('ready');
					});
				});
			}).then(null, this.handleError.bind(this));
	}

	/**
	 * Updates the server Timer delay
	 * @param {integer} delay The new delay for the server tick
	 * @returns {Server} Returns itself for chaining
	 */
	setTick(delay) {
		this.options.tick = delay;
		
		// Reset timer
		if (this._timer) {
			this._timer.stop();
			this._timer = null;
		}

		if (delay) this._timer = new Timer(delay);

		return this;
	}

	/**
	 * Adds a channel to listen for on attached clients
	 * @param {string} name The name of the channel to attach
	 * @param {function} handler The handler to attach to the channel
	 * @param {object} options The options object for the channel
	 * @returns {Server} Returns itself for chaining
	 */
	subscribe(name, handler, options) {
		if (!this.channels.hasOwnProperty(name)) {
			this.channels[name] = [];
		}
		this.channels[name].push([name + '', handler, options]);

		this.connections.forEach(client => {
			client.subscribe(name, handler, options);
		});

		return this;
	}

	/**
	 * Removes a handler on attached clients
	 * @param {string} name The name of the channel
	 * @param {function} handler The handler to remove from the channel
	 * @returns {Server} Returns itself for chaining
	 */
	unsubscribe(name, handler) {
		if (this.channels.hasOwnProperty(name)) {
			this.channels[name].forEach((subs, i) => {
				if (subs[1] === handler) this.channels[name].splice(i, 1);
			});

			this.connections.forEach(client => {
				client.unsubscribe(name, handler);
			});
		}

		return this;
	}

	/**
	 * Returns all the currently unsent packets from clients
	 * @returns {array} The unset packets
	 */
	dump() {
		return this.connections.map(client => {
			let res = Object.assign({}, client.options);
			res.channels = {};
			for (let channel in client.channels) {
				if (client.channels.hasOwnProperty(channel)) {
					res.channels[channel] = client.channels[channel].packets;
				}
			}
			return res;
		});
	}

	/**
	 * Sends data to all connected clients
	 * !! Creates the channel if it doesn't exist !!
	 * @param {string} channel The name of the channel to send to
	 * @param {string|object} payload The payload to send
	 * @returns {Server} Returns itself for chaining
	 */
	broadcast(channel, payload) {
		for (let i = this.connections.length - 1; i >= 0; i--) {
			this.connections[i].send(channel, payload);
		}

		return this;
	}

	/**
	 * Sends data to all connected clients with a specific channel opened
	 * !! Does not create new channels !!
	 * @param {string} channel The name of the channel to send to
	 * @param {string|object} payload The payload to send
	 * @returns {Server} Returns itself for chaining
	 */
	whisper(channel, payload) {
		for (let i = this.connections.length - 1; i >= 0; i--) {
			for (let u in this.connections[i].channels) {
				if (this.connections[i].channels[u].name === channel) {
					this.connections[i].channels[u].send(payload);
				}
			}
		}

		return this;
	}

	/**
	 * Closes the server
	 * @param {function} callback The callback method for the operation
	 */
	stop(callback) {
		callback = callback || function() {};
		let adapter = adapters.resolve(this.options.adapter);

		debug('warn: stopping server');

		if (this._timer) this._timer.stop();

		if (this.listener) {
			Promise.resolve()
				.then(() => {
					this.connections.forEach(adapter.disconnect);
					this.connections.length = 0;
					adapter.stop(this, callback);
					this.listener = null;
				}).then(null, this.handleError.bind(this))
		}
		else {
			this.listener = null;
			process.nextTick(callback);
		}
	}

	/**
	 * Creates a new client with the provided arguments
	 * @private
	 * @param {Socket} socket The received connection socket
	 * @param {object} options The options for the client
	 * @returns {Client} The newly created client
	 */
	createClient(options, socket) {
		let client = new Client(options, socket);
		Object.keys(this.channels).forEach(channel => {
			this.channels[channel].forEach(subs => {
				client.subscribe.apply(client, subs);
			});
		});
		return client
	}

	/**
	 * Server error handler
	 * @param {Error} err The triggered error
	 */
	handleError(err) {
		debug('error: ', err);
		this.emit('error', err);
	}

	/**
	 * Handler for receiving a new connection
	 * @private
	 * @param {Socket} socket The received connection socket
	 */
	handleRequest(socket) {
		let client = this.createClient({
			adapter: this.options.adapter,
			encoder: this.options.encoder,
			tick: this._timer,
			catch: this.catch
		}, socket);
		this.connections.push(client);
		client.on('disconnect', socket => {
			this.emit('disconnect', socket);
			this.emit('disconnection', socket);
		});
		this.emit('connection', client);
		this.emit('connect', client);
		return client;
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Server;
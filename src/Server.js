/**
 * Server class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

const debug = require('debug')('kalm');

var defaults = require('./defaults');
var Client = require('./Client');
var Timer = require('./Timer');
var adapters = require('./adapters');

/* Methods -------------------------------------------------------------------*/

class Server extends EventEmitter {

	/**
	 * Server constructor
	 * @param {object} options The configuration options for the server
	 */
	constructor(options={}) {
		super();

		this.id = crypto.randomBytes(20).toString('hex');

		this.listener = null;
		this._timer = null;

		this.options = {
			adapter: options.adapter || defaults.adapter,
			encoder: options.encoder || defaults.encoder,
			port: options.port || defaults.port,
			tick: defaults.tick,
			socketTimeout: options.socketTimeout || defaults.socketTimeout
		};

		this.connections = [];
		this.channels = options.channels || {};

		this.listen();
		this.setTick(this.options.tick);
	}

	/**
	 * Server lift method
	 */
	listen() {
		let adapter = adapters.resolve(this.options.adapter);

		if (adapter) {
			debug(
				'log: listening ' + 
				this.options.adapter + 
				'://0.0.0.0:' + 
				this.options.port
			);
			
			adapter.listen(this, () => {
				process.nextTick(() => {
					this.emit('ready');
				});
			});
		}
		else {
			debug('error: no adapter found "' + this.options.adapter + '"');
		}
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
		this.channels[name + ''] = handler;

		this.connections.forEach((client) => {
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
		this.channels[name + ''] = null;

		this.connections.forEach((client) => {
			client.unsubscribe(name, handler);
		});

		return this;
	}

	/**
	 * Returns all the currently unsent packets from clients
	 * @returns {array} The unset packets
	 */
	dump() {
		return this.connections.map((client) => {
			let res = Object.assign({}, client.options);
			res.channels = {};
			for (let channel in client.channels) {
				res.channels[channel] = client.channels[channel].packets;
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
		for (var i = this.connections.length - 1; i >= 0; i--) {
			for (var u in this.connections[i].channels) {
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
	stop(callback=()=>{}) {
		let adapter = adapters.resolve(this.options.adapter);

		debug('warn: stopping server');

		if (this._timer) this._timer.stop();

		if (this.listener) {
			this.connections.forEach(adapter.disconnect);
			this.connections.length = 0;
			adapter.stop(this, callback);
			this.listener = null;
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
		return new Client(options, socket);
	}

	/**
	 * Server error handler
	 * @param {Error} err The triggered error
	 */
	handleError(err) {
		debug('error: ' + err);
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
			channels: this.channels,
			tick: this._timer
		}, socket);
		this.connections.push(client);
		client.on('disconnect', (socket) => {
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
/**
 * Server class
 * @class Server
 * @exports {Server}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;

const debug = require('debug')('kalm');

var defaults = require('./defaults');
var Client = require('./Client');
var adapters = require('./adapters');

/* Methods -------------------------------------------------------------------*/

class Server extends EventEmitter {

	/**
	 * Server constructor
	 * @constructor
	 * @param {object} options The configuration options for the server
	 */
	constructor(options) {
		super();
		options = options || {};

		this.options = {
			adapter: options.adapter || defaults.adapter,
			encoder: options.encoder || defaults.encoder,
			port: options.port || defaults.port
		};

		this.connections = [];
		this.channels = options.channels || {};

		this.listen();
	}

	/**
	 * Server lift method
	 * @method listen
	 * @memberof Server
	 * @param {function} callback The callback method for server lift
	 */
	listen(callback) {
		var adapter = adapters.resolve(this.options.adapter);

		if (adapter) {
			debug('log: listening ' + this.options.adapter + '://0.0.0.0:' + this.options.port);
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
	 * Adds a channel to listen for on attached clients
	 * @method channel
	 * @memberof Server
	 * @param {string} name The name of the channel to attach
	 * @param {function} handler The handler to attach to the channel
	 * @returns {Server} Returns itself for chaining
	 */
	channel(name, handler) {
		name = name + '';
		this.channels[name] = handler;

		for (var i = this.connections.length - 1; i >= 0; i--) {
			this.connections[i].channel(name, handler);
		}

		return this;
	}

	/**
	 * Sends data to all connected clients
	 * !! Creates the channel if it has to !!
	 * @method broadcast
	 * @memberof Server
	 * @param {string} channel The name of the channel to send to
	 * @param {string|object} payload The payload to send
	 * @returns {Server} Returns itself for chaining
	 */
	broadcast(channel, payload) {
		for (var i = this.connections.length - 1; i >= 0; i--) {
			this.connections[i].send(channel, payload);
		}

		return this;
	}

	/**
	 * Sends data to all connected clients with a specific channel opened
	 * !! Does not create new channels !!
	 * @method whisper
	 * @memberof Server
	 * @param {string} channel The name of the channel to send to
	 * @param {string|object} payload The payload to send
	 * @returns {Server} Returns itself for chaining
	 */
	whisper(channel, payload) {
		for (var i = this.connections.length - 1; i >= 0; i--) {
			for (var u = this.connections[i].channels.length -1; u >= 0; u--) {
				if (this.connections[i].channels[u].name === channel) {
					this.connections[i].channels[u].send(payload);
				}
			}
		}

		return this;
	}

	/**
	 * Closes the server
	 * @method stop
	 * @memberof Server
	 * @param {function} callback The callback method for the operation
	 */
	stop(callback) {
		debug('warn: stopping server');
		if (this.listener) {
			adapters.resolve(this.options.adapter).stop(this, callback);
		}
		else {
			callback();
		}
	}

	/**
	 * Creates a new client with the provided arguments
	 * @private
	 * @method _createClient
	 * @memberof Server
	 * @param {Socket} socket The received connection socket
	 * @param {object} options The options for the client
	 * @returns {Client} The newly created client
	 */
	_createClient(socket, options) {
		return new Client(socket, options);
	}

	/**
	 * Handler for receiving a new connection
	 * @private
	 * @method _handleRequest
	 * @memberof Server
	 * @param {Socket} socket The received connection socket
	 */
	_handleRequest(socket) {
		var client = this._createClient(socket, {
			adapter: this.options.adapter,
			encoder: this.options.encoder,
			channels: this.channels
		});
		this.connections.push(client);
		this.emit('connection', client);
		return client;
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Server;
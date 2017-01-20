/**
 * Server class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

const debug = require('debug')('kalm');

const Client = require('./Client');
const Timer = require('./Timer');
const adapters = require('./adapters');

Promise = require('bluebird');

/* Methods -------------------------------------------------------------------*/

const Actions = {
	listener: null,
	connections: [],

	/**
	 * Server lift method
	 */
	listen: function() {
		debug(
			'log: listening ' + 
			this.adapter + 
			'://0.0.0.0:' + 
			this.port
		);
			
		Promise.resolve()
			.then(() => {
				this.adapter.listen.call(null, this, () => {
					process.nextTick(() => {
						this.emit('ready');
					});
				});
			}).then(null, this.handleError.bind(this));
	},

	/**
	 * Adds a channel to listen for on attached clients
	 * @param {string} name The name of the channel to attach
	 * @param {function} handler The handler to attach to the channel
	 * @param {object} options The options object for the channel
	 * @returns {Server} Returns itself for chaining
	 */
	subscribe: function(name, handler, options) {
		if (!this.channels.hasOwnProperty(name)) {
			this.channels[name] = [];
		}
		this.channels[name].push([name + '', handler, options]);

		this.connections.forEach(client => {
			client.subscribe(name, handler, options);
		});

		return this;
	},

	/**
	 * Removes a handler on attached clients
	 * @param {string} name The name of the channel
	 * @param {function} handler The handler to remove from the channel
	 * @returns {Server} Returns itself for chaining
	 */
	unsubscribe: function(name, handler) {
		if (this.channels.hasOwnProperty(name)) {
			this.channels[name].forEach((subs, i) => {
				if (subs[1] === handler) this.channels[name].splice(i, 1);
			});

			this.connections.forEach(client => {
				client.unsubscribe(name, handler);
			});
		}

		return this;
	},

	/**
	 * Sends data to all connected clients
	 * @param {string} channel The name of the channel to send to
	 * @param {string|object} payload The payload to send
	 * @returns {Server} Returns itself for chaining
	 */
	broadcast: function(channel, payload) {
		for (let i = this.connections.length - 1; i >= 0; i--) {
			this.connections[i].send(channel, payload);
		}

		return this;
	},

	/**
	 * Closes the server
	 * @param {function} callback The callback method for the operation
	 */
	stop: function(callback) {
		callback = callback || function() {};
		debug('warn: stopping server');

		if (this.listener) {
			Promise.resolve()
				.then(() => {
					this.connections.forEach(this.adapter.disconnect.bind(null));
					this.connections.length = 0;
					adapter.stop.call(null, this, callback);
					this.listener = null;
				}).then(null, this.handleError.bind(this))
		}
		else {
			this.listener = null;
			process.nextTick(callback);
		}
	},

	/**
	 * Server error handler
	 * @param {Error} err The triggered error
	 */
	handleError: function(err) {
		debug('error: ', err);
		this.emit('error', err);
	},

	/**
	 * Handler for receiving a new connection
	 * @private
	 * @param {Socket} socket The received connection socket
	 */
	handleRequest: function(socket) {
		let client = Client.create({
			adapter: this.adapter,
			encoder: this.encoder,
			catch: this.catch,
			socket,
			isServer: true,
			channels: this.channels
		});
		this.connections.push(client);
		this.emit('connect', client);

		this.on('subscribe', client.subscribe.bind(client));
		this.on('unsubscribe', client.unsubscribe.bind(client));
		return client;
	}
}

function create(options) {
	return Object.assign(
		{ id: crypto.randomBytes(20).toString('hex') },
		Multiplexed,
		EventEmitter.prototype,
		Actions,
		options
	);
}

/* Exports -------------------------------------------------------------------*/

module.exports = create;
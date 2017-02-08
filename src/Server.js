/**
 * Server class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

const debug = require('debug')('kalm');

const Client = require('./Client');
const Multiplexed = require('./Multiplexed');

/* Methods -------------------------------------------------------------------*/

const Actions = {
	listener: null,
	connections: [],

	/**
	 * Server lift method
	 */
	listen: () => {
		debug(`log: listening ${this.transport}://0.0.0.0:${this.port}`);
			
		this.transport.listen(null, () => this.emit('ready'));
	},

	/**
	 * Adds a channel to listen for on attached clients
	 * @param {string} name The name of the channel to attach
	 * @param {function} handler The handler to attach to the channel
	 * @param {object} options The options object for the channel
	 * @returns {Server} Returns itself for chaining
	 */
	subscribe: (name, handler, options) => {
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
	unsubscribe: (name, handler) => {
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
	broadcast: (channel, payload) => {
		console.log(this);
		for (let i = this.connections.length - 1; i >= 0; i--) {
			this.connections[i].send(channel, payload);
		}

		return this;
	},

	/**
	 * Closes the server
	 * @param {function} callback The callback method for the operation
	 */
	stop: (callback) => {
		callback = callback || function() {};
		debug('warn: stopping server');

		if (this.listener) {
			Promise.resolve()
				.then(() => {
					this.connections.forEach(this.transport.disconnect.bind(null));
					this.connections.length = 0;
					this.transport.stop(this, callback);
					this.listener = null;
				}).then(null, this.handleError.bind(this))
		}
		else {
			this.listener = null;
			setTimeout(callback, 0);
		}
	},

	/**
	 * Server error handler
	 * @param {Error} err The triggered error
	 */
	handleError: (err) => {
		debug('error: ', err);
		this.emit('error', err);
	},

	/**
	 * Handler for receiving a new connection
	 * @private
	 * @param {Socket} socket The received connection socket
	 */
	handleConnection: (socket) => {
		const origin = this.transport.getOrigin(socket);
		const hash = crypto.createHash('sha1');
		hash.update(this.id);
		hash.update(origin.host);
		hash.update(origin.port);

		const client = Client.create({
			id: hash.digest('hex'),
			transport: this.transport,
			serial: this.serial,
			catch: this.catch,
			socket,
			isServer: true,
			channels: this.channels
		});

		
		this.connections.push(client);
		this.emit('connection', client, Session.fetch(client.id));

		this.on('subscribe', client.subscribe.bind(client));
		this.on('unsubscribe', client.unsubscribe.bind(client));
		return client;
	}
}

class Server extends EventEmitter {
	constructor(options) {
		super();

		this.id = crypto.randomBytes(8).toString('hex');
		Object.assign(this,
			new Multiplexed({}),
			Actions,
			options
		);
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Server;
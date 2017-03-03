/**
 * Server class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const debug = require('debug')('kalm');
const clientFactory = require('../clientFactory');
const sessions = require('../utils/sessions');
const crypto = require('crypto');

/* Methods -------------------------------------------------------------------*/

function Server(scope) {
	return {
		/**
		 * Sends data to all connected clients
		 * @param {string} channel The name of the channel to send to
		 * @param {string|object} payload The payload to send
		 * @returns {Server} Returns itself for chaining
		 */
		broadcast: (channel, payload) => {
			for (let i = scope.connections.length - 1; i >= 0; i--) {
				scope.connections[i].send(channel, payload);
			}

			return scope;
		},

		/**
		 * Closes the server
		 * @param {function} callback The callback method for the operation
		 */
		stop: (callback) => {
			callback = callback || function() {};
			debug('warn: stopping server');

			if (scope.listener) {
				Promise.resolve()
					.then(() => {
						scope.connections.forEach(scope.transport.disconnect.bind(null));
						scope.connections.length = 0;
						scope.transport.stop(scope, callback);
						scope.listener = null;
					}).then(null, scope.handleError.bind(scope))
			}
			else {
				scope.listener = null;
				setTimeout(callback, 0);
			}
		},

		/**
		 * Server error handler
		 * @param {Error} err The triggered error
		 */
		handleError: (err) => {
			debug('error: ', err);
			scope.emit('error', err);
		},

		/**
		 * Handler for receiving a new connection
		 * @private
		 * @param {Socket} socket The received connection socket
		 */
		handleConnection: (socket) => {
			const origin = scope.transport.getOrigin(socket);
			const hash = crypto.createHash('sha1');
			hash.update(scope.id);
			hash.update(origin.host);
			hash.update('' + origin.port);

			socket.__connected = true;

			const client = clientFactory.create({
				id: hash.digest('hex'),
				transport: scope.transport,
				serial: scope.serial,
				catch: scope.catch,
				socket,
				secretKey: scope.secretKey,
				isServer: true,
				hostname: origin.host,
				port: origin.port
			});
			
			scope.connections.push(client);
			scope.emit('connection', client, sessions.resolve(client.id));
			client.on('disconnect', scope.emit.bind('disconnection'));
			return client;
		}
	};
}

/* Exports -------------------------------------------------------------------*/

module.exports = Server;
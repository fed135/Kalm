/**
 * Client class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const crypto = require('crypto');

const serializer = require('../utils/serializer');
const debug = require('debug')('kalm');
const profiles = require('../profiles');
const sessions = require('../utils/sessions');

/* Local variables -----------------------------------------------------------*/

const _pendingChannel = '_pending';

/* Methods -------------------------------------------------------------------*/

function Client(scope) {
	return {
		/**
		 * Queues a packet for transfer on the given channel
		 * @param {string} name The channel to send to data through
		 * @param {string|object} payload The payload to send
		 * @param {boolean} once Wether to override packets with scope one
		 * @returns {Client} The client, for chaining
		 */
		write: (name, message) => {
			scope.queue(name)
				.add(scope.serial ? scope.serial.encode(message) : message);
			return scope;
		},

		/**
		 * Sends a packet - triggered by middlewares
		 * @param {string} channel The channel targeted for transfer
		 */
		end: (queue, packets) => {
			const payload = serializer.serialize(queue.frame, queue.name, packets);
			if (scope.socket.__connected) scope.transport.send(scope.socket, payload);
			else scope.backlog.push(payload);
		},

		/**
		 * Destroys the client and connection
		 */
		destroy: () => {
			Promise.resolve()
				.then(scope.transport.disconnect.bind(null, scope))
				.then(null, scope.handleError.bind(scope));
			
			for (let channel in scope.queues) {
				if (scope.queues.hasOwnProperty(channel)) {
					scope.queues[channel].resetBundler();
				}
			}
		},

		transaction: (name, message) => {
			const transactionId = crypto.randomBytes(8).toString('hex');
			const ret = Promise.defer();

			scope.subscribe(transactionId, (req) => {
				scope.unsubscribe(transactionId);
				ret.resolve(req);
			});
			scope.transport.send(
				transactionId, 
				serializer.serialize(0, name, scope.serial.encode(message))
			);

			return ret.promise;
		},

		handleTransaction: (req) => {
			scope.trigger(req.body.channel, {
				body: req.body.message,
				client: scope,
				frame: { channel: req.body.transactionId },
				session: sessions.resolve(scope.id)
			});
		},
		
		handleConnect: () => {
			scope.socket.__connected = true;
			scope.backlog.forEach(scope.transport.send.bind(null, scope.socket));
			scope.backlog.length = 0;
			scope.emit('connect', scope);
		},

		handleError: (err) => {
			debug(`error: ${err.message}`);
		},

		handleRequest: (payload) => {
			const raw = serializer.deserialize(payload);
			raw.packets.forEach((packet, messageIndex) => {
				scope.trigger(raw.channel, {
					body: scope.serial ? scope.serial.decode(packet) : packet,
					client: scope,
					reply: scope.write.bind(null, raw.channel),
					frame: {
						id: raw.frame,
						channel: raw.channel,
						payloadBytes: raw.payloadBytes,
						payloadMessages: raw.packets.length,
						messageIndex
					},
					session: sessions.resolve(scope.id)
				});
			});
		},

		handleDisconnect: () => {
			scope.socket.__connected = false;
			scope.emit('disconnect', scope);
		}
	};
}

/* Exports -------------------------------------------------------------------*/

module.exports = Client;
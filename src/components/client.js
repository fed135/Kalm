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
const encrypter = require('../utils/encrypter');

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
			let payload = serializer.serialize(queue.frame, queue.name, packets);
			if (scope.secretKey !== null) payload = encrypter.encrypt(payload, scope.secretKey);
			if (scope.socket.__connected) scope.transport.send(scope.socket, payload);
			else scope.backlog.push(payload);
		},

		/**
		 * Destroys the client and connection
		 */
		destroy: () => {
			if (scope.socket.__connected) scope.transport.disconnect(scope, scope.socket);
			
			
			for (let channel in scope.queues) {
				if (scope.queues.hasOwnProperty(channel)) {
					scope.queues[channel].resetBundler();
				}
			}
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
			const frames = serializer.deserialize((scope.secretKey !== null) ? encrypter.decrypt(payload, scope.secretKey) : payload);
			frames.forEach((frame) => {
				frame.packets.forEach((packet, messageIndex) => {
					Promise.resolve()
						.then(() => scope.serial ? scope.serial.decode(packet) : packet)
						.catch(err => packet)
						.then((decodedPacket) => {
							scope.trigger(frame.channel, {
								body: decodedPacket,
								client: scope,
								reply: scope.write.bind(null, frame.channel),
								frame: {
									id: frame.frame,
									channel: frame.channel,
									payloadBytes: frame.payloadBytes,
									payloadMessages: frame.packets.length,
									messageIndex
								},
								session: sessions.resolve(scope.id)
							});
						});					
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
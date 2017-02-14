/**
 * Client class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const serializer = require('../utils/serializer');
const debug = require('debug')('kalm');
const profiles = require('../profiles');

/* Local variables -----------------------------------------------------------*/

const pending_channel = '_pending';

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
		send: (name, payload) => {
			scope.queue(name)
				.add(scope.serial.encode(payload));
			return scope;
		},

		/**
		 * Sends a packet - triggered by middlewares
		 * @param {string} channel The channel targeted for transfer
		 */
		end: (queue, packets) => {
			if (scope.socket.__connected) {
				const payload = serializer.serialize(queue.frame, queue.name, packets);
				scope.transport.send(scope.socket, payload);
			}
			else {
				//scope.queue(pending_channel)
					//.add()
				console.log('fuck');
			}
		},

		/**
		 * Destroys the client and connection
		 */
		destroy: () => {
			Promise.resolve()
				.then(() => {
					scope.transport.disconnect(scope);
					//Self called?
					//scope.handleDisconnect()
				})
				.then(null, scope.handleError.bind(scope));
			
			for (let channel in scope.queues) {
				if (scope.queues.hasOwnProperty(channel)) {
					scope.queues[channel].resetBundler();
				}
			}
		},
		
		handleConnect: () => {
			scope.socket.__connected = true;
			scope.emit('connect', scope);
		},

		handleError: (err) => {
			debug(`error: ${err.message}`);
		},

		handleRequest: (payload) => {
			const raw = serializer.deserialize(payload);
			raw.packets.forEach((packet, message_index) => {
				scope.trigger(raw.channel, {
					body: scope.serial.decode(packet),
					client: scope,
					frame: {
						id: raw.frame,
						channel: raw.channel,
						payload_bytes: raw.payload_bytes,
						payload_messages: raw.packets.length,
						message_index
					}
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
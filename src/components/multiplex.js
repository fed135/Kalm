/**
 * Multiplexed
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

function Multiplexed(scope) {
	return {
		/**
		 * Creates a channel for the client
		 * @param {string} name The name of the channel.
		 * @param {function} handler The handler to add to the channel
		 * @returns {Client} The client, for chaining
		 */
		subscribe: (name, handler) => {
			name = '' + name;
			scope.channels[name] = scope.channels[name] || [];
			scope.channels[name].push(handler);
			if (scope.connections) scope.emit('subscribe', name, handler);
		},

		/**
		 * Removes a handler from a channel
		 * @param {string} name The name of the channel.
		 * @param {function} handler The handler to remove from the channel
		 * @returns {Client} The client, for chaining
		 */
		unsubscribe: (name, handler) => {
			name = '' + name;
			scope.channels[name] = (scope.channels[name] || [])
				.filter((event) => event !== handler && handler !== undefined);
			if (scope.connections) scope.emit('unsubscribe', name, handler);
		},

		trigger: (name, params) => {
			(scope.channels[name] || [])
				.forEach((handler) => handler(params));
		}
	};
}

/* Exports -------------------------------------------------------------------*/

module.exports = Multiplexed;
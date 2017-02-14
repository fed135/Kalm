/**
 * Multiplexed
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

function Multiplexed(scope) {
	return {
		channels: [],
		/**
		 * Creates a channel for the client
		 * @param {string} name The name of the channel.
		 * @param {function} handler The handler to add to the channel
		 * @returns {Client} The client, for chaining
		 */
		subscribe: (name, options) => {
			const config = Object.assign({
				handler: console.log,
				once: false
			}, options);

			config.name = '' + name;
			scope.channels[config.name] = scope.channels[config.name] || [];
			scope.channels[config.name].push(config);
			if (scope.connections) scope.emit('subscribe', name, options);
			console.log(config, scope.channels);
		},

		/**
		 * Removes a handler from a channel
		 * @param {string} name The name of the channel.
		 * @param {function} handler The handler to remove from the channel
		 * @returns {Client} The client, for chaining
		 */
		unsubscribe: (name, options) => {
			const config = Object.assign({}, options);

			config.name = '' + name;
			scope.channels[config.name] = (scope.channels[config.name] || [])
				.filter((event) => event.handler !== config.handler && config.handler !== undefined);
			if (scope.connections) scope.emit('unsubscribe', name, options);
		},

		trigger: (name, params) => {
			//console.log('triggering', name, 'with', params);
			console.log(scope.channels);
			scope.channels[name] = (scope.channels[name] || [])
				.filter((event) => {
					event.handler(params);
					return !event.once;
				});
		}
	};
}

/* Exports -------------------------------------------------------------------*/

module.exports = Multiplexed;
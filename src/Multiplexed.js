/**
 * Multiplexed
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

const Multiplexed = {
	/**
	 * Creates a channel for the client
	 * @param {string} name The name of the channel.
	 * @param {function} handler The handler to add to the channel
	 * @returns {Client} The client, for chaining
	 */
	subscribe: function(name, options) {
		const config = Object.assign({
			handler: console.log,
			once: false
		}, options);

		config.name = '' + name;
		channels[config.name] = channels[config.name] || [];
		channels[config.name].push(config);
	},

	/**
	 * Removes a handler from a channel
	 * @param {string} name The name of the channel.
	 * @param {function} handler The handler to remove from the channel
	 * @returns {Client} The client, for chaining
	 */
	unsubscribe: function(name, options) {
		const config = Object.assign({}, options);

		config.name = '' + name;
		channels[config.name] = (channels[config.name] || [])
			.filter((event) => event.handler !== config.handler && config.handler !== undefined);
	},

	trigger: function(name, params) {
		channels[config.name] = (channels[config.name] || [])
			.filter((event) => {
				event.handler.apply(null, params);
				return !event.once;
			});
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Multiplexed;
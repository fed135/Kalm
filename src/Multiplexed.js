/**
 * Multiplexed
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

const Multiplexed = {
	channels: {},

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
		this.channels[config.name] = this.channels[config.name] || [];
		this.channels[config.name].push(config);
		this.emit('subscribe', name, options);

		return this;
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
		this.channels[config.name] = (this.channels[config.name] || [])
			.filter((event) => event.handler !== config.handler && config.handler !== undefined);

		this.emit('unsubscribe', name, options);
		return this;
	},

	trigger: function(name, params) {
		this.channels[config.name] = (this.channels[config.name] || [])
			.filter((event) => {
				event.handler.apply(null, params);
				return !event.once;
			});
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Multiplexed;
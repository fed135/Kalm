/**
 * Client class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

const debug = require('debug')('kalm');

const Serializer = require('./Serializer');
const Profiles = require('./Profiles')
const Queue = require('./Queue');

/* Methods -------------------------------------------------------------------*/

const Actions = {
	/**
	 * Queues a packet for transfer on the given channel
	 * @param {string} name The channel to send to data through
	 * @param {string|object} payload The payload to send
	 * @param {boolean} once Wether to override packets with this one
	 * @returns {Client} The client, for chaining
	 */
	send: function(name, payload) {
		if (!this.queues.hasOwnProperty(name)) {
			this.queues[name] = new Queue(this);
		}
		this.queues[name].add(this.encoder.encode(payload));
		return this;
	},

	/**
	 * Trumps other packets on the given channel, will only send the latest
	 * @param {string} name The channel to send to data through
	 * @param {string|object} payload The payload to send 
	 * @returns {Client} The client, for chaining
	 */
	sendNow: function(name, payload) {		
		this.send(name, payload);
		this.queues[name].process();
		return this;
	},

	/**
	 * Sends a packet - triggered by middlewares
	 * @param {string} channel The channel targeted for transfer
	 */
	_emit: function(channel, packets) {
		const payload = Serializer.serialize(this.frame, channel, packets);

		this.adapter.send(this.socket, payload);
	},

	/**
	 * Destroys the client and connection
	 */
	destroy: function() {
		Promise.resolve()
			.then(() => {
				this.adapter.disconnect(this);
				//Self called?
				//this.handleDisconnect()
			})
			.then(null, this.handleError.bind(this));
		
		for (let channel in this.queues) {
			if (this.queues.hasOwnProperty(channel)) {
				this.queues[channel].resetBundler();
			}
		}
	}
}

function create(options) {
	return Object.assign(
		{ id: crypto.randomBytes(20).toString('hex') },
		Multiplexed,
		Queued,
		Serialized,
		EventEmitter.prototype,
		Actions,
		options
	);
}

/* Exports -------------------------------------------------------------------*/

module.exports = create;
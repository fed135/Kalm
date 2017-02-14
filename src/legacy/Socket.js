/**
 * Socket handles
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

const Socket = {
	socket: null,
	connected: false,
	isServer: false,
	hostname: '0.0.0.0',
	port: 3000,
	socketTimeout: 10000,
	rejectForeign: true,
	frameCounter: 0,
	catch: null,

	/**
	 * Defines a socket to use for communication, disconnects previous one
	 * @param {Socket} socket The socket to use
	 * @returns {Client} The client, for chaining
	 */
	use: function(socket) {
		if (this.socket) this.destroy();

		this.socket = this.adapter.createSocket(this, socket);
		return this;
	},

	/**
	 * Socket error handler
	 * @param {Error} err The socket triggered error
	 * @returns {Client} The client, for chaining
	 */
	handleError: function(err) {
		debug('error: ', err);
		this.emit('error', err);
		return this;
	},

	/**
	 * New socket connection handler
	 * @param {Socket} socket The newly connected socket
	 * @returns {Client} The client, for chaining
	 */
	handleConnect: function(socket) {
		debug('log: connection established');
		this.connected = true;
		this.emit('connect', socket);

		// In the case of a reconnection, we want to resume channel bundlers
		Object.keys(this.queues).forEach((channel) => {
			this.queues[channel].startBundler();
		});
		return this;
	},

	/**
	 * Socket connection lost handler
	 * @returns {Client} The client, for chaining
	 */
	handleDisconnect: function() {
		debug('warn: connection lost');
		this.connected = false;
		this.emit('disconnect');
		this.socket = null;
		return this;
	},

	/**
	 * Handler for receiving data through the listener
	 * Malformed or invalid payloads should result in a killing of the socket
	 * @param {Buffer} evt The data received
	 */
	handleRequest: function(payload) {
		if (payload.length <= 1) return;

		let raw = Serializer.deserialize(payload);
		if (raw.packets.length && this.channels.hasOwnProperty(raw.channel)) {
			for (let i = 0; i < raw.packets.length; i++) {
				let packet = this.encoder.decode(packets[i]);
				for (let listener = 0; listener < this.channels[raw.channel]; listener++) {
					this.channels[raw.channel][listener]({
						body: packet,
						client: this,
						channel: raw.channel,
						frame: {
							id: raw.id,
							payload_bytes: raw.payload_bytes,
							payload_messages: raw.packets.length,
							message_index: i
						}
					}, this.reply.bind(this, raw.channel));
				}
			}
		}
	}
};
/**
 * TCP transport methods
 * @module transports.TCP
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const net = require('net');
const split = require('binary-split');

/* Methods -------------------------------------------------------------------*/

const actions = {

	/**
	 * Listens for tcp connections, updates the 'listener' property of the server
	 * @param {Server} server The server object
	 * @param {function} callback The success callback for the operation
	 */
	listen: function(server, options, callback) {
		const res = Promise.defer();
		const listener = net.createServer(server.handleRequest.bind(server));
		listener.on('error', server.handleError.bind(server));
		listener.listen(options.port, res.resolve.bind(res, listener));
		return res.promise;
	},

	getOrigin: function(socket) {
		return {
			host: socket.remoteAddress,
			port: socket.remotePort
		};
	},

	/**
	 * Creates a client
	 * @param {Client} client The client to create the socket for
	 * @param {Socket} socket Optionnal existing socket object.
	 * @returns {Socket} The created tcp client
	 */
	createSocket: function(options) {
		return net.connect(options.port, options.hostname);
	},

	attachSocket: function(socket, client) {
		let stream = socket.pipe(split());
		stream.on('data', client.handleRequest.bind(client));
		socket.on('error', client.handleError.bind(client));
		socket.on('connect', client.handleConnect.bind(client));
		socket.on('close', client.handleDisconnect.bind(client));

		// Add timeout listener, sever connection
		socket.on('timeout', () => this.disconnect(client));
		socket.setTimeout(client.options.socketTimeout);
	},
	/**
	 * Stops the server
	 * @placeholder
	 * @param {Server} server The server object
	 * @param {function} callback The success callback for the operation
	 */
	stop: function(server, callback) {
		server.listener.close(() => setTimeout(callback, 0));
	},

	/**
	 * Sends a message with a socket client
	 * @placeholder
	 * @param {Socket} socket The socket to use
	 * @param {Buffer} payload The body of the request
	 */
	send: function(socket, payload) {
		socket.write(payload);
	},

	/**
	 * @placeholder
	 * Attempts to disconnect the client's connection
	 * @param {Client} client The client to disconnect
	 */
	disconnect: function(client, socket) {
		socket.destroy();
		setTimeout(client.handleDisconnect.bind(client), 0);
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = actions;
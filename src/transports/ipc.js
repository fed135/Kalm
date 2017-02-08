/**
 * IPC transport methods
 * @module transports.IPC
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const net = require('net');
const fs = require('fs');
const split = require('binary-split');

/* Local variables -----------------------------------------------------------*/

const _path = '/tmp/app.socket-';

/* Methods -------------------------------------------------------------------*/

const actions = {

	/**
	 * Returns a new listener
	 * @param {Server} server The server object
	 * @param {object} options The options for the listener
	 * @param {function} callback The callback for the operation
	 * @returns {Promise(object)} The new listener
	 */
	listen: function(server, options, callback) {
		const res = Promise.defer();
		fs.unlink(_path + options.port, (err) => {
			const listener = net.createServer(server.handleRequest.bind(server));
			listener.on('error', server.handleError.bind(server));
			listener.listen(_path + options.port, res.resolve.bind(res, listener));
		});
		return res.promise;
	},

	getOrigin: function(socket) {
		return {
			host: socket.remoteAddress,
			port: socket.remotePort
		};
	},

	/**
	 * Creates a client and adds the data listener(s) to it
	 * @param {Client} client The client to create the socket for
	 * @param {Socket} socket Optionnal existing socket object.
	 * @returns {Socket} The created ipc socket
	 */
	createSocket: function(options) {
		return net.connect(_path + options.port);
	},

	attachSocket: function(socket, client) {
		let stream = socket.pipe(split());
		stream.on('data', client.handleRequest.bind(client));

		// Emit on error
		socket.on('error', client.handleError.bind(client));

		// Emit on connect
		socket.on('connect', client.handleConnect.bind(client));

		// Will auto-reconnect
		socket.on('close', client.handleDisconnect.bind(client));

		// Add timeout listener, sever connection
		socket.on('timeout', () => this.disconnect(client));
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
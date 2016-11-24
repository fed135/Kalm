/**
 * InterProcessCall connector methods
 * @module adapters/ipc
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const net = require('net');
const fs = require('fs');
const split = require('binary-split');

/* Local variables -----------------------------------------------------------*/

const _path = '/tmp/app.socket-';
const SEP = new Buffer('\n');

/* Methods -------------------------------------------------------------------*/

class IPC {

	/**
	 * Listens for ipc connections, updates the 'listener' property of the server
	 * @param {Server} server The server object
	 * @param {function} callback The callback for the operation
	 */
	static listen(server, callback) {
		fs.unlink(_path + server.options.port, () => {
			server.listener = net.createServer(server.handleRequest.bind(server));
			server.listener.listen(_path + server.options.port, callback);
			server.listener.on('error', server.handleError.bind(server));
		});
	}

	/**
	 * Creates a client and adds the data listener(s) to it
	 * @param {Client} client The client to create the socket for
	 * @param {Socket} socket Optionnal existing socket object.
	 * @returns {Socket} The created ipc socket
	 */
	static createSocket(client, socket) {
		if (!socket) {
			socket = net.connect(_path + client.options.port);
		}

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

		return socket;
	}

	/**
	 * Stops the server
	 * @placeholder
	 * @param {Server} server The server object
	 * @param {function} callback The success callback for the operation
	 */
	static stop(server, callback) {
		server.listener.close(() => {
			process.nextTick(callback);
		});
	}

	/**
	 * Sends a message with a socket client
	 * @placeholder
	 * @param {Socket} socket The socket to use
	 * @param {Buffer} payload The body of the request
	 */
	static send(socket, payload) {
		if (socket) {
			socket.write(payload);
			socket.write(SEP);
		}
	}

	/**
	 * @placeholder
	 * Attempts to disconnect the client's connection
	 * @param {Client} client The client to disconnect
	 */
	static disconnect(client) {
		if (client.socket && client.socket.destroy) {
			client.socket.destroy();
			process.nextTick(client.handleDisconnect.bind(client));
		}
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = IPC;
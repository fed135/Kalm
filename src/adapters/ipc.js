/**
 * InterProcessCall connector methods
 * @module adapters/ipc
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const net = require('net');
const fs = require('fs');
const split = require('binary-split');

const Adapter = require('./common');

/* Local variables -----------------------------------------------------------*/

const _path = '/tmp/app.socket-';

/* Methods -------------------------------------------------------------------*/

class IPC extends Adapter {

	/**
	 * IPC adapter constructor
	 */
	constructor() {
		super('ipc');
	}

	/**
	 * Listens for ipc connections, updates the 'listener' property of the server
	 * @param {Server} server The server object
	 * @param {function} callback The callback for the operation
	 */
	listen(server, callback) {
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
	createSocket(client, socket) {
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
}

/* Exports -------------------------------------------------------------------*/

module.exports = new IPC;
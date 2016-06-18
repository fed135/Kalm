/**
 * TCP connector methods
 * @module adapters/tcp
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const net = require('net');
const split = require('binary-split');

const Adapter = require('./common');

/* Methods -------------------------------------------------------------------*/

class TCP extends Adapter {

	/**
	 * TCP adapter constructor
	 */
	constructor() {
		super('tcp');
	}

	/**
	 * Listens for tcp connections, updates the 'listener' property of the server
	 * @param {Server} server The server object
	 * @param {function} callback The success callback for the operation
	 */
	listen(server, callback) {
		server.listener = net.createServer(server.handleRequest.bind(server));
		server.listener.listen(server.options.port, callback);
		server.listener.on('error', server.handleError.bind(server));
	}

	/**
	 * Creates a client
	 * @param {Client} client The client to create the socket for
	 * @param {Socket} socket Optionnal existing socket object.
	 * @returns {Socket} The created tcp client
	 */
	createSocket(client, socket) {
		if (!socket) {
			socket = net.connect(client.options.port, client.options.hostname);
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

		// Set timeout
		socket.setTimeout(client.options.socketTimeout);

		return socket;
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = new TCP;
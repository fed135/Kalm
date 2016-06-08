/**
 * Adapter Commons
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

class Adapter {
	
	/**
	 * Adapter constructor
	 */
	constructor(type) {
		this.type = type;
	}

	/**
	 * Listens for connections, updates the 'listener' property of the server
	 * @placeholder
	 * @param {Server} server The server object
	 * @param {function} callback The callback for the operation
	 */
	listen() {}

	/**
	 * Stops the server
	 * @placeholder
	 * @param {Server} server The server object
	 * @param {function} callback The success callback for the operation
	 */
	stop(server, callback) {
		server.listener.close(callback);
	}

	/**
	 * Sends a message with a socket client
	 * @placeholder
	 * @param {Socket} socket The socket to use
	 * @param {Buffer} payload The body of the request
	 */
	send(socket, payload) {
		if (socket) socket.end(payload);
	}

	/**
	 * Creates a client and adds the data listener(s) to it
	 * @placeholder
	 * @param {Client} client The client to create the socket for
	 * @param {Socket} socket Optionnal existing socket object
	 * @returns {Socket} The created socket
	 */
	createSocket() {}

	/**
	 * @placeholder
	 * Attempts to disconnect the client's connection
	 * @param {Client} client The client to disconnect
	 */
	disconnect(client) {
		if (client.socket && client.socket.destroy) {
			client.socket.destroy();
			client.handleDisconnect();
		}
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Adapter;
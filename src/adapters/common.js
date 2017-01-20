/**
 * Adapter Commons
 */

'use strict';

/* Local variables -----------------------------------------------------------*/

const SEP = new Buffer('\n');

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
	listen() {
		throw new Error('not implemented');
	}

	/**
	 * Stops the server
	 * @placeholder
	 * @param {Server} server The server object
	 * @param {function} callback The success callback for the operation
	 */
	stop(server, callback) {
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
	send(socket, payload) {
		if (socket) {
			socket.write(payload);
			socket.write(SEP);
		}
	}

	/**
	 * Creates a client and adds the data listener(s) to it
	 * @placeholder
	 * @param {Client} client The client to create the socket for
	 * @param {Socket} socket Optionnal existing socket object
	 * @returns {Socket} The created socket
	 */
	createSocket() {
		throw new Error('not implemented');
	}

	/**
	 * @placeholder
	 * Attempts to disconnect the client's connection
	 * @param {Client} client The client to disconnect
	 */
	disconnect(socket) {
		if (socket && socket.destroy) socket.destroy();
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Adapter;
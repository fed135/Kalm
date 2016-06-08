/**
 * UDP connector methods
 * @module adapters/udp
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const dgram = require('dgram');

const Adapter = require('./common');

/* Local variables -----------------------------------------------------------*/

const _socketType = 'udp4';
const _startByte = 0;
const _keySeparator = ':';

/* Methods -------------------------------------------------------------------*/

class UDP extends Adapter {

	/**
	 * UDP adapter constructor
	 */
	constructor() {
		super('udp');
	}

	/**
	 * Creates a socket + Client on UDP data
	 * @private
	 * @param {Server} server The server object
	 * @param {array} data Payload from an incomming request
	 * @param {object} origin The call origin info
	 */ 
	_handleNewSocket(server, data, origin) {
		var key = [origin.address, _keySeparator, origin.port].join();

		if (!server.__clients) server.__clients = {};
		if (!(key in server.__clients)) {
			server.__clients[key] = server.createClient({
				hostname: origin.address,
				port: origin.port,
				adapter: this.type,
				encoder: server.options.encoder,
				channels: server.channels
			});
		}

		server.__clients[key].handleRequest(data);
	}

	/**
	 * Listens for udp connections, updates the 'listener' property of the server
	 * @param {Server} server The server object
	 * @param {function} callback The success callback for the operation
	 */
	listen(server, callback) {
		server.listener = dgram.createSocket({
			type: _socketType,
			reuseAddr: true
		});
		server.listener.on('message', (data, origin) => {
			this._handleNewSocket(server, data, origin)
		});
		server.listener.on('error', server.handleError.bind(server));
		server.listener.bind(server.options.port, '127.0.0.1');
		
		return callback();
	}

	/**
	 * Sends a message with a socket client
	 * @param {Socket} socket The socket to use
	 * @param {Buffer} payload The body of the request
	 */
	send(socket, payload) {
		if (socket) {
			socket.send(
				payload, 
				_startByte, 
				payload.length, 
				socket.__port, 
				socket.__hostname
			);
		}
	}

	/**
	 * Stops the server.
	 * @param {Server} server The server object
	 * @param {function} callback The success callback for the operation
	 */
	stop(server, callback) {
		for (var client in server.__clients) {
			this.disconnect(server.__clients[client]);
		}
		server.listener.close();
		if (callback) callback();
	}

	/**
	 * Creates a client
	 * @param {Client} client The client to create the socket for
	 * @param {Socket} soc Optionnal existing socket object. - Not used for UPC
	 * @returns {Socket} The created tcp client
	 */
	createSocket(client, soc) {
		if (soc) return soc;

		var socket = dgram.createSocket(_socketType);
		socket.__port = client.options.port;
		socket.__hostname = client.options.hostname;

		// Emit on error
		socket.on('error', client.handleError.bind(client));

		// Emit on connect
		process.nextTick(client.handleConnect.bind(client));

		return socket;
	}

	/**
	 * Attempts to disconnect the client's connection
	 * @param {Client} client The client to disconnect
	 */
	disconnect(client) {
		// Nothing to do
		client.handleDisconnect();
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = new UDP;
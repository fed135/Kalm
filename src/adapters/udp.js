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
const _localAddress = '0.0.0.0';

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
		let key = [origin.address, _keySeparator, origin.port].join();

		if (!server.__clients) server.__clients = {};
		if (!(key in server.__clients)) {
			server.__clients[key] = server.createClient.call(server, {
				hostname: origin.address,
				port: origin.port,
				adapter: this.type,
				encoder: server.options.encoder
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
		server.listener.bind(server.options.port, _localAddress);
		
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
		for (let client in server.__clients) {
			if (server.__clients.hasOwnProperty(client)) {
				this.disconnect(server.__clients[client]);
			}
		}
		server.listener.close();
		process.nextTick(callback);
	}

	/**
	 * Creates a client
	 * @param {Client} client The client to create the socket for
	 * @param {Socket} soc Optionnal existing socket object. - Not used for UPC
	 * @returns {Socket} The created tcp client
	 */
	createSocket(client, soc) {
		if (soc) return soc;

		// Create a UDP writing socket
		let socket = dgram.createSocket(_socketType);
		socket.__port = client.options.port;
		socket.__hostname = client.options.hostname;

		// Emit on error
		socket.on('error', client.handleError.bind(client));

		// Bind socket to also listen on it's address
		socket.bind(null, _localAddress);

		socket.on('message', client.handleRequest.bind(client));

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
		process.nextTick(client.handleDisconnect.bind(client));
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = new UDP;
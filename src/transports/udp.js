/**
 * UDP transport methods
 * @module transports.UDP
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const dgram = require('dgram');

/* Local variables -----------------------------------------------------------*/

const _socketType = 'udp4';
const _keySeparator = ':';
const _localAddress = '0.0.0.0';
const _reuseAddr = true;

/* Methods -------------------------------------------------------------------*/

/**
 * Creates a socket + Client on UDP data
 * @private
 * @param {Server} server The server object
 * @param {array} data Payload from an incomming request
 * @param {object} origin The call origin info
 */
function _handleNewSocket(server, data, origin) {
		let key = [origin.address, _keySeparator, origin.port].join();

		if (!server.__clients) server.__clients = {};
		if (!(key in server.__clients)) {
			server.__clients[key] = server.createClient({
				hostname: origin.address,
				port: origin.port,
				adapter: 'udp',
				encoder: server.options.encoder
			});
		}

		server.__clients[key].handleRequest(data);
	}

const actions = {

	/**
	 * Listens for udp connections, updates the 'listener' property of the server
	 * @param {Server} server The server object
	 * @param {function} callback The success callback for the operation
	 */
	listen: function(server, options, callback) {
		const listener = dgram.createSocket({ type: _socketType, reuseAddr: _reuseAddr });
		listener.on('message', _handleNewSocket.bind(null, server))
		listener.on('error', server.handleError.bind(server));
		listener.bind(options.port, _localAddress);
		
		return Promise.resolve(listener);
	},

	getOrigin: function(socket) {
		return {
			host: socket.hostname,
			port: socket.port
		};
	},

	/**
	 * Sends a message with a socket client
	 * @param {Socket} socket The socket to use
	 * @param {Buffer} payload The body of the request
	 */
	send: function(socket, payload) {
		socket.send(payload, 0, payload.length, socket._port, socket._hostname);
	},

	/**
	 * Stops the server.
	 * @param {Server} server The server object
	 * @param {function} callback The success callback for the operation
	 */
	stop: function(server, callback) {
		Object.keys(server.__clients).forEach((client) => {
			actions.disconnect(server.__clients[client])
		});
		server.listener.close();
		setTimeout(callback, 0);
	},

	/**
	 * Creates a client
	 * @param {Client} client The client to create the socket for
	 * @param {Socket} soc Optionnal existing socket object. - Not used for UPC
	 * @returns {Socket} The created tcp client
	 */
	createSocket: function(options) {
		let socket = dgram.createSocket(_socketType);
		socket._port = options.port;
		socket._hostname = options.hostname;
		setTimeout(client.handleConnect.bind(client), 0);

		return socket;
	},

	attachSocket: function(socket, client) {
		socket.on('error', client.handleError.bind(client));
		socket.on('message', client.handleRequest.bind(client));

		// Bind socket to also listen on it's address
		socket.bind(null, _localAddress);
	},

	/**
	 * Attempts to disconnect the client's connection
	 * @param {Client} client The client to disconnect
	 */
	disconnect: function(client) {
		// Nothing to do
		setTimeout(client.handleDisconnect.bind(client), 0);
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = actions;
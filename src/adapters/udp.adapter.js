/**
 * UDP connector methods
 * @module adapters/udp
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const dgram = require('dgram');

/* Helpers -------------------------------------------------------------------*/

/**
 * Creates a socket + Client on UDP data
 * @private
 * @param {array} data Payload from an incomming request
 * @param {object} origin The call origin info
 */ 
function _handleNewSocket(data, origin) {
	var key = origin.address + ':' + origin.port;

	if (!this.__clients) this.__clients = {};
	if (!(key in this.__clients)) {
		this.__clients[key] = this.createClient({
			hostname: origin.address,
			port: origin.port,
			adapter: 'udp',
			encoder: this.options.encoder,
			channels: this.channels
		}, {});
	}

	this.__clients[key].handleRequest(data);
}

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for udp connections, updates the 'listener' property of the server
 * @param {Server} server The server object
 * @param {function} callback The success callback for the operation
 */
function listen(server, callback) {
	server.listener = dgram.createSocket('udp4');
	server.listener.on('message', _handleNewSocket.bind(server));
	server.listener.on('error', server.handleError.bind(server));
	server.listener.bind(server.options.port, '127.0.0.1');
	
	return callback();
}

/**
 * Sends a message with a socket client
 * @param {Socket} socket The socket to use
 * @param {Buffer} payload The body of the request
 */
function send(socket, payload) {
	socket.send(
		payload, 
		0, 
		payload.length, 
		socket.__port, 
		socket.__hostname
	);
}

/**
 * Stops the server.
 * @param {Server} server The server object
 * @param {function} callback The success callback for the operation
 */
function stop(server, callback) {
	server.listener.close(callback);
}

/**
 * Creates a client
 * @param {Client} client The client to create the socket for
 * @param {Socket} soc Optionnal existing socket object. - Not used for UPC
 * @returns {Socket} The created tcp client
 */
function createSocket(client, soc) {
	if (soc) return soc;

	var socket = dgram.createSocket('udp4');
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
function disconnect(client) {
	// Nothing to do
	client.handleDisconnect();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send,
	createSocket: createSocket,
	stop: stop,
	disconnect: disconnect
};
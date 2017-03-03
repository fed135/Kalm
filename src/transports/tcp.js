/**
 * TCP transport methods
 * @module transports.TCP
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const net = require('net');

/* Local variables -----------------------------------------------------------*/

const _socketTimeout = 300000;	// 5 Minutes

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for tcp connections, updates the 'listener' property of the server
 * @param {Server} server The server object
 */
function listen (server, options) {
	const res = Promise.defer();
	const listener = net.createServer(server.handleConnection.bind(server));
	listener.on('error', server.handleError.bind(server));
	listener.listen(options.port, res.resolve.bind(res, listener));
	return res.promise;
}

function getOrigin(socket) {
	return {
		host: socket.remoteAddress,
		port: socket.remotePort
	};
}

/**
 * Creates a client
 * @param {Client} client The client to create the socket for
 * @param {Socket} socket Optionnal existing socket object.
 * @returns {Socket} The created tcp client
 */
function createSocket(client) {
	return net.connect(client.port, client.hostname);
}

function attachSocket(socket, client) {
	socket.on('data', client.handleRequest.bind(client));
	socket.on('error', client.handleError.bind(client));
	socket.on('connect', client.handleConnect.bind(client));
	socket.on('close', client.handleDisconnect.bind(client));
	socket.on('timeout', () => this.disconnect(client));
	socket.setTimeout(client.socketTimeout || _socketTimeout);
}

/**
 * Stops the server
 * @placeholder
 * @param {Server} server The server object
 * @param {function} callback The success callback for the operation
 */
function stop(server, callback) {
	server.listener.close(() => setTimeout(callback, 0));
}

/**
 * Sends a message with a socket client
 * @placeholder
 * @param {Socket} socket The socket to use
 * @param {Buffer} payload The body of the request
 */
function send(socket, payload) {
	socket.write(payload);
}

/**
 * @placeholder
 * Attempts to disconnect the client's connection
 * @param {Client} client The client to disconnect
 */
function disconnect(client) {
	client.socket.end();
	client.socket.destroy();
	setTimeout(client.handleDisconnect.bind(client), 0);
}

/* Exports -------------------------------------------------------------------*/

module.exports = { listen, getOrigin, stop, send, disconnect, createSocket, attachSocket };
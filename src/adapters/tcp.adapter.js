/**
 * TCP connector methods
 * @adapter tcp
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const net = require('net');

const debug = require('debug')('kalm');

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for tcp connections, updates the 'listener' property of the server
 * @method listen
 * @param {Server} server The server object
 * @param {function} callback The success callback for the operation
 */
function listen(server, callback) {
	server.listener = net.createServer(server._handleRequest.bind(server));
	server.listener.listen(server.options.port, callback);
	server.listener.on('error', (err) => {
		debug('error: ' + err);
		server.emit('error', err);
	});
}

/**
 * Sends a message with a socket client
 * @method send
 * @param {Socket} socket The socket to use
 * @param {Buffer} payload The body of the request
 */
function send(socket, payload) {
	if (socket) socket.write(payload);
}

/**
 * Stops the server.
 * @method stop
 * @param {Server} server The server object
 * @param {function} callback The success callback for the operation
 */
function stop(server, callback) {
	server.connections.forEach(disconnect);
	
	process.nextTick(() => {
		server.connections.length = 0;
		server.listener.close(callback || function() {});
	});
}

/**
 * Creates a client
 * @method createSocket
 * @param {Client} client The client to create the socket for
 * @param {Socket} socket Optionnal existing socket object.
 * @returns {Socket} The created tcp client
 */
function createSocket(client, socket) {
	if (!socket) {
		socket = net.connect(client.options.port, client.options.hostname);
	}
	socket.on('data', client._handleRequest.bind(client));
	socket.on('error', (err) => {
		debug('error: ' + err);
		client.emit('error', err);
	});

	// Will auto-reconnect
	socket.on('close', () => {
		client.socket = null;
	});

	return socket;
}

/**
 * Attempts to disconnect the client's connection
 * @method disconnect
 * @param {Client} client The client to disconnect
 */
function disconnect(client) {
	if (client.socket && client.socket.destroy) {
		client.socket.destroy();
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send,
	createSocket: createSocket,
	stop: stop,
	disconnect: disconnect
};
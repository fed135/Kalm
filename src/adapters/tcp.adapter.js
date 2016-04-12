/**
 * TCP connector methods
 * @adapter tcp
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var net = require('net');

var debug = require('debug')('kalm');

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
	server.listener.on('error', function _handleServerError(err) {
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
	server.connections.forEach(function _killConnection(e) {
		e.socket.destroy();
	});
	
	process.nextTick(function() {
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
	socket.on('error', function _handleSocketError(err) {
		debug('error: ' + err);
		client.emit('error', err);
	});

	// Will auto-reconnect
	socket.on('close', function _handleSocketClosed() {
		client.socket = null;
	});

	return socket;
}

/**
 * Attempts to disconnect the socket
 * @method disconnect
 * @param {Socket} socket The socket to disconnect
 */
function disconnect(socket) {
	if (socket.disconnect) socket.disconnect();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send,
	createSocket: createSocket,
	stop: stop,
	disconnect: disconnect
};
/**
 * InterProcessCall connector methods
 * @adapter tcp
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var net = require('net');

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for tcp connections on the selected port.
 * @method listen
 * @memberof TCP
 * @param {function} callback The success callback for the operation
 */
function listen(server, callback) {
	server.listener = net.createServer(server._handleRequest.bind(server));
	server.listener.listen(server.options.port, callback);
	server.listener.on('error', function _handleServerError(err) {
		server.emit('error', err);
	});
}

/**
 * Sends a message with a socket client
 * @method send
 * @memberof TCP
 * @param {Buffer} payload The body of the request
 * @param {Socket} socket The socket to use
 * @param {function|null} callback The callback method
 */
function send(socket, payload) {
	console.log('write');
	socket.write(payload);
}

function stop(server, callback) {
	server.listener.close(callback || function() {});
}

/**
 * Creates a client
 * @method createSocket
 * @memberof TCP
 * @param {Client} client The client to create the socket for
 * @returns {Socket} The created tcp client
 */
function createSocket(client, socket) {
	if (!socket) {
		socket = net.connect(client.options.port, client.options.hostname);
	}
	socket.on('data', client._handleRequest.bind(client));
	socket.on('error', function _handleSocketError(err) {
		client.emit('error', err);
	});

	return socket;
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send,
	createSocket: createSocket,
	stop: stop
};
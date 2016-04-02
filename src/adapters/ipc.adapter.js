/**
 * InterProcessCall connector methods
 * @adapter ipc
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var net = require('net');
var fs = require('fs');

/* Local variables -----------------------------------------------------------*/

var defaultPath = '/tmp/app.socket-';

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for ipc connections, updates the 'listener' property of the server
 * @method listen
 * @param {Server} server The server object
 * @param {function} callback The callback for the operation
 */
function listen(server, callback) {
	fs.unlink(defaultPath + server.options.port, function _bindSocket() {
		server.listener = net.createServer(server._handleRequest.bind(server));
		server.listener.listen(defaultPath + server.options.port, callback);
		server.listener.on('error', function _handleServerError(err) {
			server.emit('error', err);
		});
	});
};

function stop(server, callback) {
	server.listener.close(callback || function() {});
}

/**
 * Sends a message with a socket client
 * @method send
 * @param {Socket} socket The socket to use
 * @param {Buffer} payload The body of the request
 */
function send(socket, payload) {
	socket.write(payload);
};

/**
 * Creates a client and adds the data listener(s) to it
 * @method createSocket
 * @param {Client} client The client to create the socket for
 * @param {Socket} socket Optionnal existing socket object.
 * @returns {Socket} The created ipc socket
 */
function createSocket(client, socket) {
	if (!socket) {
		socket = net.connect(defaultPath + client.options.port);
	}
	socket.on('data', client._handleRequest.bind(client));
	socket.on('error', function _handleSocketError(err) {
		client.emit('error', err);
	});

	return socket;
};

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
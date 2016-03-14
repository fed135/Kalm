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
 * @param {Kalm.Server} server The server object
 * @param {function} callback The callback for the operation
 */
function listen(server, callback) {
	fs.unlink(this.path, function _bindSocket() {
		server.listener = net.createServer(server._handleRequest);
		server.listener.listen(defaultPath + server.options.port, callback);
	});
};

/**
 * Sends a message with a socket client, then pushes it back to its peer
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
 * @param {Kalm.Client} client The client to create the socket for
 * @returns {Socket} The created ipc socket
 */
function createSocket(client) {
	var socket = net.connect(defaultPath + this.options.port);
	socket.on('data', client._handleRequest.bind(client));

	return socket;
};

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send,
	createSocket: createSocket
};
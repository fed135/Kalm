/**
 * IPC transport methods
 * @module transports.IPC
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const net = require('net');
const fs = require('fs');

/* Local variables -----------------------------------------------------------*/

const _path = '/tmp/app.socket-';

/* Methods -------------------------------------------------------------------*/

/**
 * Returns a new listener
 * @param {Server} server The server object
 * @param {object} options The options for the listener
 * @param {function} callback The callback for the operation
 * @returns {Promise(object)} The new listener
 */
function listen(server, options, callback) {
	const res = Promise.defer();
	fs.unlink(_path + options.port, (err) => {
		const listener = net.createServer(server.handleConnection.bind(server));
		listener.on('error', server.handleError.bind(server));
		listener.listen(_path + options.port, res.resolve.bind(res, listener));
	});
	return res.promise;
}

function getOrigin(socket) {
	return {
		host: socket._server._pipeName,
		port: '' + socket._handle.fd
	};
}

/**
 * Creates a client and adds the data listener(s) to it
 * @param {Client} client The client to create the socket for
 * @param {Socket} socket Optionnal existing socket object.
 * @returns {Socket} The created ipc socket
 */
function createSocket(client) {
	return net.connect(_path + client.port);
}

function attachSocket(socket, client) {
	socket.on('data', client.handleRequest.bind(client));
	socket.on('error', client.handleError.bind(client));
	socket.on('connect', client.handleConnect.bind(client));
	socket.on('close', client.handleDisconnect.bind(client));
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
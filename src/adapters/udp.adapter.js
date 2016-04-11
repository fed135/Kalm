/**
 * UDP connector methods
 * @adapter udp
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var dgram = require('dgram');

/* Helpers -------------------------------------------------------------------*/

/**
 * Creates a socket + Client on UDP data
 */ 
function _handleNewSocket(data, origin) {
	var key = origin.address+':'+origin.port;

	if (!this.__clients) this.__clients = {};
	if (!(key in this.__clients)) {
		this.__clients[key] = this._handleRequest(createSocket({
			options: {
				hostname: origin.address,
				port: origin.port
			}
		}));
	}

	this.__clients[key]._handleRequest(data);
}

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for udp connections, updates the 'listener' property of the server
 * @method listen
 * @param {Server} server The server object
 * @param {function} callback The success callback for the operation
 */
function listen(server, callback) {
	server.listener = dgram.createSocket('udp4');
	server.listener.on('message', _handleNewSocket.bind(server));
	server.listener.on('error', function _handleServerError(err) {
		server.emit('error', err);
	});
	server.listener.bind(server.options.port, '127.0.0.1');
	
	callback();
};

/**
 * Sends a message with a socket client
 * @method send
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
};

/**
 * Stops the server.
 * @method stop
 * @param {Server} server The server object
 * @param {function} callback The success callback for the operation
 */
function stop(server, callback) {
	server.connections.length = 0;
	if (server.listener && server.listener.close) {
		server.listener.close(callback);
	}
	else callback();
}

/**
 * Creates a client
 * @method createSocket
 * @param {Client} client The client to create the socket for
 * @param {Socket} soc Optionnal existing socket object. - Not used for UPC
 * @returns {Socket} The created tcp client
 */
function createSocket(client, soc) {
	if (soc) return soc;

	var socket = dgram.createSocket('udp4');
	socket.__port = client.options.port;
	socket.__hostname = client.options.hostname;
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
	// Nothing to do
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send,
	createSocket: createSocket,
	stop: stop,
	disconnect: disconnect
};
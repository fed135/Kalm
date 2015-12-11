/**
 * InterProcessCall connector methods
 * @adapter ipc
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var ipc = require('ipc-light');

/* Methods -------------------------------------------------------------------*/

/**
 * IPC adapter
 * @constructor
 */
function IPC() {
	this.type = 'ipc';
	this.server = null;
}

/**
 * Listens for ipc connections on the selected port.
 * @method listen
 * @memberof IPC
 * @param {object} options The config object for that adapter
 * @param {function} handler The central handling method for requests
 * @param {function} callback The success callback for the operation
 */
IPC.prototype.listen = function(options, handler, callback) {
	var _self = this;
	this.server = ipc.createServer(function(req) {
		handler(req, _self);
	}).listen(options.path + options.port, callback);
}

/**
 * Sends a message with a socket client, then pushes it back to its service
 * @method send
 * @param {Service} service The service to send to
 * @param {object} options The details of the request
 * @param {Socket} socket The socket to use
 * @param {function|null} callback The callback method
 */
function send(service, options, socket, callback) {
	socket.client.emit(options, function() {
		if (!service._pushSocket(socket)) {
			socket.client.disconnect();
		}

		if (callback) callback();
	});
}

/**
 * Checks if a socket is valid and ready to send some data
 * @method isConnected
 * @param {Socket} socket The socket to check
 * @returns {boolean} Wether the socket is valid or not
 */
function isConnected(socket) {
	return (socket.client.socket);
}

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @param {object} options The config object for that adapter
 * @param {Service} service The service to create the socket for
 * @returns {ipc.Client} The created ipc client
 */
function createClient(options, service) {
	var socket = ipc.connect({
		path: options.path + service.port
	});

	socket.ondisconnect.add(function() {
		service._removeSocket(socket);
	});

	socket.onerror.add(function() {
		service._removeSocket(socket);
	});

	return socket;
}

/**
 * Stops listening for ipc connections and closes the server
 * @method stop
 * @param {function|null} callback The callback method
 */ 
function stop(callback) {
	if (server) server.close(callback);
	else callback();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	name: 'ipc',
	listen: listen,
	createClient: createClient,
	isConnected: isConnected,
	send: send,
	stop: stop
};
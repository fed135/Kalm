/**
 * InterProcessCall connector methods
 * @adapter tcp
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var net = require('net');

/* Local variables -----------------------------------------------------------*/

var server = null;

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for tcp connections on the selected port.
 * @method listen
 * @param {object} options The config object for that adapter
 * @param {function} handler The central handling method for requests
 * @param {function} callback The success callback for the operation
 */
function listen(options, handler, callback) {
	server = net.createServer(function(req) {
		req.on('data', function(data) {
			data = JSON.parse(data.toString());
			if (!req.payload) req = { payload: req };
			if (!req.origin) req.origin = {};
			data.origin.adapter = 'tcp';
			handler(data);
		});
		
	}).listen(options.port, callback);
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
	socket.client.write(JSON.stringify(options), function() {
		if (!service._pushSocket(socket)) {
			socket.client.destroy();
		}

		if (callback) callback();
	});
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

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @param {object} options The config object for that adapter
 * @param {Service} service The service to create the socket for
 * @returns {Socket} The created tcp client
 */
function createClient(options, service) {
	var socket = net.connect(service);

	socket.on('disconnect', function() {
		service._removeSocket(socket);
	});

	socket.on('error', function() {
		if (socket && socket.disconnect) {
			socket.disconnect();
		}
		service._removeSocket(socket);
	});
	return socket;
}

/**
 * Checks if a socket is valid and ready to send some data
 * @method isConnected
 * @param {Socket} socket The socket to check
 * @returns {boolean} Wether the socket is valid or not
 */
function isConnected(socket) {
	return (socket.client.status === 'connected');
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	name: 'tcp',
	listen: listen,
	send: send,
	isConnected: isConnected,
	createClient: createClient,
	stop: stop
};
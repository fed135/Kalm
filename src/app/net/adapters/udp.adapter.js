/**
 * InterProcessCall connector methods
 * @adapter udp
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var dgram = require('dgram');

/* Local variables -----------------------------------------------------------*/

var server = null;

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for udp connections on the selected port.
 * @method listen
 * @param {object} options The config object for that adapter
 * @param {function} handler The central handling method for requests
 * @param {function} callback The success callback for the operation
 */
function listen(options, handler, callback) {
	server = dgram.createSocket('udp4');
	server.on('message', function (req) {
		req = JSON.parse(req.toString());
		if (!req.payload) req = { payload: req };
		if (!req.origin) req.origin = {};
		req.origin.adapter = 'udp';
		handler(req);
	});
	server.bind(options.port, '127.0.0.1');
	callback();
}

/**
 * Checks if a socket is valid and ready to send some data
 * @method isConnected
 * @param {Socket} socket The socket to check
 * @returns {boolean} Wether the socket is valid or not
 */
function isConnected(socket) {
	return socket.client.__active;
}

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @param {object} options The config object for that adapter
 * @param {Service} service The service to create the socket for
 * @returns {dgram.Socket} The created udp client
 */
function createClient(options, service) {
	var socket = dgram.createSocket('udp4');
	socket.__active = true;
	service._updateSocketStatus(socket);

	return socket;
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
	var message = new Buffer(JSON.stringify(options));
	socket.client.send(
		message, 
		0, 
		message.length, 
		service.port, 
		service.hostname, 
		function(err, bytes) {
			if (err !== 0 || bytes !== message.length) {
				socket.client.close();
				socket.client.__active = false;
			}
			else {
				if (!service._pushSocket(socket)) {
					socket.client.close();
					socket.client.__active = false;
				}
			}

			if (callback) callback();
		}
	);
}

/**
 * Stops listening for udp connections and closes the server
 * @method stop
 * @param {function|null} callback The callback method
 */ 
function stop(callback) {
	if (server) server.close(callback);
	else callback();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	name: 'udp',
	listen: listen,
	createClient: createClient,
	isConnected: isConnected,
	send: send,
	stop: stop
};
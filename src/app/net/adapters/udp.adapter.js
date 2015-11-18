/**
 * InterProcessCall connector methods
 * @adapter udp
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var dgram = require('dgram');

/* Local variables -----------------------------------------------------------*/

/** Stores the ipc server object */
var server = null;

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for udp connections on the selected port.
 * @method listen
 * @param {function} done The success callback for the operation
 */
function listen(done) {
	var config = K.getComponent('config');
	var connection = K.getComponent('connection');
	var cl = K.getComponent('console');

	cl.log('   - Starting udp server  [ :' + config.connections.udp.port + ' ]');

	server = dgram.createSocket('udp4');
	server.on('message', function (req) {
		req = JSON.parse(req.toString());
		if (!req.payload) req = { payload: req };
		if (!req.origin) req.origin = {};
		req.origin.adapter = 'udp';
		connection.handleRequest(req, function(payload, callback) {
			var circles = K.getComponent('circles');
			var service = circles.find('global')
				.service(req.meta.sId);
			// Service existing or created during handleRequest
			var socket = service.socket();
			connection.send(service, payload, socket, callback);
		});
	});
	server.bind(config.connections.udp.port, '127.0.0.1');
	done();
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
 * @param {Service} service The service to create the socket for
 * @returns {ipc.Client} The created ipc client
 */
function createClient(service) {
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
	var cl = K.getComponent('console');
	socket.client.send(
		message, 
		0, 
		message.length, 
		service.port, 
		service.hostname, 
		function(err, bytes) {
			if (err !== 0 || bytes !== message.length) {
				cl.error(err);
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
	var cl = K.getComponent('console');
	cl.warn('   - Stopping udp server');
	
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
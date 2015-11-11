/**
 * InterProcessCall connector methods
 * @adapter ipc
 * @exports {object}
 */

'use strict'

/* Requires ------------------------------------------------------------------*/

var ipc;
if (process.env.IPC_HOME) ipc = require(process.env.IPC_HOME);
else ipc = require('ipc-light');

/* Local variables -----------------------------------------------------------*/

/** Stores the ipc server object */ 
var server = null;

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for ipc connections on the selected port.
 * @method listen
 * @param {function} done The success callback for the operation
 */
function listen(done) {
	var config = K.getComponent('config');
	var manifest = K.getComponent('manifest');
	var cl = K.getComponent('console');
	var connection = K.getComponent('connection');

	cl.log('   - Starting ipc server  [ :' + config.connections.ipc.port + ' ]');

	server = ipc.createServer(function(req) {
		req.origin.adapter = 'ipc';
		connection.handleRequest(req, function(payload, callback) {
			var circles = K.getComponent('circles');
			var service = circles.find('global')
				.service(req.metadata.serviceId);
			// Service existing or created during handleRequest
			var socket = service.socket();
			connection.send(service, payload, socket, callback);
		});
	}).listen(config.connections.ipc.path + config.connections.ipc.port, done);
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
	socket.client.emit(options);

	if (!service._pushSocket(socket)) {
		socket.client.disconnect();
	}

	if (callback) callback();
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
 * @param {Service} service The service to create the socket for
 * @returns {ipc.Client} The created ipc client
 */
function createClient(service) {
	var config = K.getComponent('config');

	var socket = ipc.connect({
		path: config.connections.ipc.path + service.port
	});

	socket.ondisconnect.add(function() {
		service._removeSocket(socket);
	});

	socket.onconnect.add(function() {
		service._updateSocketStatus(socket);
	});

	socket.ondata.add(function(e) {
		service.onRequest.dispatch(e, function(payload, callback) {
			send(service, payload, socket, callback);
		});
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
	var cl = K.getComponent('console');
	cl.warn('   - Stopping ipc server');
	
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
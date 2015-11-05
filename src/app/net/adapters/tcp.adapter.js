/**
 * InterProcessCall connector methods
 * @adapter tcp
 * @exports {object}
 */

'use strict'

/* Requires ------------------------------------------------------------------*/

var net = require('net');

/* Local variables -----------------------------------------------------------*/

/** Stores the ipc server object */
var server = null;

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for tcp connections on the selected port.
 * @method listen
 * @param {function} done The success callback for the operation
 */
function listen(done) {
	var config = K.getComponent('config');
	var connection = K.getComponent('connection');
	var cl = K.getComponent('console');

	cl.log('   - Starting tcp server  [ :' + config.connections.tcp.port + ' ]');

	server = net.createServer(function(req, res) {
		req.on('data', function(data) {
			var data = JSON.parse(data.toString());
			req.on('end', function() {
				data.origin.adapter = 'tcp';
				connection.handleRequest(data);
			});
		});
		
	}).listen(config.connections.tcp.port, done);
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
	socket.client.end(JSON.stringify(options));

	if (!service._pushSocket(socket)) {
		socket.client.disconnect();
	}

	if (callback) callback();
}

/**
 * Stops listening for ipc connections and closes the server
 * @method stop
 * @param {function|null} callback The callback method
 */ 
function stop(callback) {
	var cl = K.getComponent('console');
	cl.warn('   - Stopping tcp server');
	
	if (server) server.close(callback);
	else callback();
}

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @param {Service} service The service to create the socket for
 * @returns {ipc.Client} The created ipc client
 */
function createClient(service) {
	var socket = net.connect(service);

	socket.on('connect', function() {
		service._updateSocketStatus(socket);
	});

	socket.on('disconnect', function() {
		service._removeSocket(socket);
	});

	socket.on('error', function(err) {
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
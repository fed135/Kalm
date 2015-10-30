/**
 * InterProcessCall connector methods
 * @adapter ipc
 * @exports {object}
 */

/* Requires ------------------------------------------------------------------*/

var ipc = require('ipc-light');

/* Local variables -----------------------------------------------------------*/

var server;

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for ipc connections on the selected port.
 * socket connections are created with a friend (which is created if not 
 * already present)
 * @method listen
 * @param {function} done The success callback for the operation
 * @param {function} failure The error callback for the operation
 */
function listen(done, failure) {
	var config = K.getComponent('config');
	var request = K.getComponent('request');
	var manifest = K.getComponent('manifest');
	var cl = K.getComponent('console');
	var connection = K.getComponent('connection');

	cl.log('   - Starting ipc server  [ :i' + manifest.id + ' ]');

	config.connections.ipc.port = 'i' + manifest.id;

	server = ipc.createServer(function(req) {
		req.origin.adapter = 'ipc';
		connection.handleRequest(req);
	}).listen(config.connections.ipc.path + 'i' + manifest.id, done);
}

/**
 * Sends a message with a socket client, then pushes it back to its service
 * @method send
 * @param {Service} service The service to send to
 * @param {object} options The details of the request
 * @param {ipc.Client} socket The socket to use
 * @param {function|null} callback The callback method
 */
function send(service, options, socket, callback) {
	socket.client.emit(options);

	if (!service._pushSocket(socket)) {
		socket.client.disconnect();
	}

	if (callback) callback();
}

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

	socket.onerror.add(function() {
		console.log('error caught');
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
	autoload: true,
	listen: listen,
	createClient: createClient,
	isConnected: isConnected,
	send: send,
	stop: stop
};
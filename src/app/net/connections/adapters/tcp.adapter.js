/**
 * InterProcessCall connector methods
 */

/* Requires ------------------------------------------------------------------*/

var net = require('net');

/* Local variables -----------------------------------------------------------*/

var server;

/* Methods -------------------------------------------------------------------*/

function listen(done, failure) {
	var config = K.getComponent('config');
	var request = K.getComponent('request');
	var cl = K.getComponent('console');

	cl.log('   - Starting tcp server  [ :' + config.connections.tcp.port + ' ]');

	server = net.createServer(function(req, reply) {
		request.init(_parseArgs(req, reply));
	}).listen(config.connections.tcp.port, done);
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
	socket.write(options);

	if (!service._pushSocket(socket)) {
		socket.client.disconnect();
	}

	if (callback) callback();
}

function stop(callback) {
	var cl = K.getComponent('console');
	cl.warn('   - Stopping tcp server');
	
	if (server) server.close(callback);
	else callback();
}

function createClient(service) {
	var socket = net.connect(options);

	socket.on('error', function(err) {
		socket.disconnect();
		service._removeSocket(socket);
	});
	return socket;
}

function isConnected(socket) {
	//TODO
	console.log('checking connected status for');
	console.log(socket);
	return (socket.client.socket);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	name: 'tcp',
	listen: listen,
	send: send,
	stop: stop
};
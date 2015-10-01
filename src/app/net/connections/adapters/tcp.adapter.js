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

function send(options, callback) {

	var socket = net.connect(options);
	socket.on('data', function(data) {
		socket.disconnect();
		if (callback) callback(null, data);
	});
	socket.on('error', function(err) {
		socket.disconnect();
		if (callback) callback(err);
	});
	socket.write(options);
}

function stop(callback) {
	var cl = K.getComponent('console');
	cl.warn('   - Stopping tcp server');
	
	if (server) server.close(callback);
}

function _parseArgs(req, res) {
	return frame.create({
		uid: req.uid,
		connection: 'tcp',
		reply: res,
		path: req.path,
		method: req.method,
		payload: req.body
	});
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	name: 'tcp',
	listen: listen,
	send: send,
	stop: stop
};
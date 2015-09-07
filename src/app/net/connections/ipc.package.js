/**
 * InterProcessCall connector methods
 */

/* Requires ------------------------------------------------------------------*/

var ipc = require('ipc-light');
var Request = require('./request.package');

/* Local variables -----------------------------------------------------------*/

var server;

/* Methods -------------------------------------------------------------------*/

function listen(done, failure) {
	var config = K.getComponent('config');
	var request = K.getComponent('request');
	var manifest = K.getComponent('manifest');
	var cl = K.getComponent('console');

	cl.log('   - Starting ipc server');

	server = ipc.createServer(function(req, reply) {
		request.init(_parseArgs(req, reply));
	}).listen(config.connections.ipc.path + manifest.id, done);
}

function send(options, message, callback) {
	options.body = message;

	var socket = ipc.connect(config.connections.ipc.path, function() {
		socket.emit(options);
		socket.disconnect();
		callback();
	});
}

function stop(callback) {
	if (server) server.close(callback);
}

function _parseArgs(req, res) {
	return new Request({
		uid: req.uid,
		connection: 'ipc',
		reply: send,
		cookie: req.headers.cookie,
		path: req.url,
		method: req.method,
		payload: req.body || null
	});
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send,
	stop: stop
};
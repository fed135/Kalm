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

	cl.log('   - Starting ipc server  [ :i' + manifest.id + ' ]');

	server = ipc.createServer(function(req, reply) {
		cl.log('Received IPC request');
		request.init(_parseArgs(req, reply));
	}).listen(config.connections.ipc.path + 'i' + manifest.id, done);
}

function send(options, message, callback) {
	var cl = K.getComponent('console');
	var config = K.getComponent('config');

	options.body = message;

	var socket = ipc.connect({
		path: config.connections.ipc.path + options.port
	});
	socket.ondata.add(function(err, data) {
		cl.log('Got response from IPC emit');
		console.log(data);
		console.log(callback);
		socket.disconnect();
		if (callback) callback(err, data)
	}); 
	socket.emit(options);
}

function stop(callback) {
	//TODO: delete the socket file
	if (server) server.close(callback);
}

function _parseArgs(req, res) {
	return new Request({
		uid: req.uid,
		connection: 'ipc',
		reply: res,
		cookie: {},
		path: req.path,
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
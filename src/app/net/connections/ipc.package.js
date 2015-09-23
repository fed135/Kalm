/**
 * InterProcessCall connector methods
 */

/* Requires ------------------------------------------------------------------*/

var ipc = require('ipc-light');
var frame = require('./frame.package');

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
		request.init(_parseArgs(req, reply));
	}).listen(config.connections.ipc.path + 'i' + manifest.id, done);
}

function send(options, callback) {
	var config = K.getComponent('config');

	var socket = ipc.connect({
		path: config.connections.ipc.path + options.port
	});
	socket.ondata.add(function(err, data) {
		socket.disconnect();
		if (callback) callback(err, data)
	}); 
	socket.emit(options);
}

function stop(callback) {
	var cl = K.getComponent('console');
	cl.warn('   - Stopping ipc server');
	
	if (server) server.close(callback);
}

function _parseArgs(req, res) {
	return frame.create({
		uid: req.uid,
		connection: 'ipc',
		reply: res,
		path: req.path,
		method: req.method,
		payload: req.body
	});
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send,
	stop: stop
};
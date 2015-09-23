/**
 * ZMQ connector methods
 */

/* Requires ------------------------------------------------------------------*/

var zmq = require('zmq');

/* Local variables -----------------------------------------------------------*/

var server;

/* Methods -------------------------------------------------------------------*/

function listen(done, failure) {
	var config = K.getComponent('config');
	var request = K.getComponent('request');
	var cl = K.getComponent('console');

	cl.log('   - Starting zmq server  [ :' + config.connections.zmq.port + ' ]');

	server = zmq.socket('pull');
	server.connect('tcp://127.0.0.1:' + config.connections.zmq.port);
	server.on('message', function(evt, body) {
		console.log(body);
	});
	done();
}

function send(options, callback) {
	var config = K.getComponent('config');
	console.log('zmq send');
	var socket = zmq.socket('push');
	socket.bindSync('tcp://' + options.hostname + ':' + options.port);
	console.log('sending ' + 'tcp://' + options.hostname + ':' + options.port);
	socket.send(options);
}

function stop(callback) {
	var cl = K.getComponent('console');
	cl.warn('   - Stopping zmq server');
	
	if (server) server.close(callback);
}

function _parseArgs(req, res) {
	return frame.create({
		uid: req.uid,
		connection: 'zmq',
		reply: function(body, code) {
			res(null, body);
		},
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
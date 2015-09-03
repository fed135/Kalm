/**
 * InterProcessCall connector methods
 */

/* Requires ------------------------------------------------------------------*/

var ipc = require('ipc-light');

/* Methods -------------------------------------------------------------------*/

function listen(done, failure) {
	var config = K.getComponent('config');
	var request = K.getComponent('request');
	
	ipc.createServer(function(req, reply) {
		request.init(req, reply);
	}).listen(config.connections.ipc.path, done);
}

function send(options, message, callback) {
	options.body = message;

	var socket = ipc.connect(config.connections.ipc.path, function() {
		socket.emit(options);
		socket.disconnect();
		callback();
	});
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send
};
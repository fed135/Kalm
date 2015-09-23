/**
 * InterProcessCall connector methods
 */

/* Requires ------------------------------------------------------------------*/

var dgram = require('dgram');
var frame = require('./frame.package');

/* Local variables -----------------------------------------------------------*/

var server;

/* Methods -------------------------------------------------------------------*/

function listen(done, failure) {
	var config = K.getComponent('config');
	var request = K.getComponent('request');
	var cl = K.getComponent('console');

	cl.log('   - Starting udp server  [ :' + config.connections.udp.port + ' ]');

	server = net.createServer(function(req, reply) {
		request.init(_parseArgs(req, reply));
	}).listen(config.connections.tcp.port, done);
	server = dgram.createSocket('udp4');
	server.on('message', function (req, reply) {
    request.init(_parseArgs(req, reply));
  });
  server.bind(config.connections.udp.port, '127.0.0.1');
}

function send(options, callback) {

	var client = dgram.createSocket('udp4');
	var message = new Buffer(options);
	client.send(message, 0, message.length, option.port, option.hostname, function(err, bytes) {
    if (err) {
    	client.close();
    	callback(err);
    }
	});

	client.on('message', function(data){
		callback(null, data.toString());
    client.close();
	});
}

function stop(callback) {
	var cl = K.getComponent('console');
	cl.warn('   - Stopping ipc server');
	
	if (server) server.close(callback);
}

function _parseArgs(req, res) {
	return frame.create({
		uid: req.uid,
		connection: 'udp',
		reply: function(body, code) {
			res.body = body;
			send(res);
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
/**
 * HTTP connector methods
 */

/* Requires ------------------------------------------------------------------*/

var http = require('http');

/* Local variables -----------------------------------------------------------*/

var server;

/* Methods -------------------------------------------------------------------*/

function listen(done, failure) {
	var cl = K.getComponent('console');
	var config = K.getComponent('config');
	var request = K.getComponent('request');
	
	cl.log('   - Starting http server');

	if (server) return done();

	server = http.createServer(function(req, res) {
		request.init(req, res, 'http');
	}).listen(config.connections.http.port,done);
}

function send(options, message, callback) {
	var req = http.request(options, callback);
	req.end(message);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send
};
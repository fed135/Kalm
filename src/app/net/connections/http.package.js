/**
 * HTTP connector methods
 */

/* Requires ------------------------------------------------------------------*/

var http = require('http');
var Request = require('./request.package');

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
		request.init(_parseArgs(req, res));
	}).listen(config.connections.http.port,done);
}

function send(options, message, callback) {
	var req = http.request(options, callback);
	req.end(message);
}

function _reply(data, code, contentType) {
	var config = K.getComponent('config');

	code = code || 200;
	contentType = contentType || config.connections.http.contentType;

	this.writeHead(code, {
		'Content-Type': contentType
	});
	this.end(JSON.stringify(data));
}

function _parseArgs(req, res) {
	return new Request({
		uid: req.uid,
		connection: 'http',
		reply: _reply.bind(res),
		cookie: req.headers.cookie,
		path: req.url,
		method: req.method,
		payload: req.body || null
	});
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send
};
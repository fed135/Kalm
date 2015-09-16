/**
 * HTTP connector methods
 */

/* Requires ------------------------------------------------------------------*/

var http = require('http');
var frame = require('./frame.package');

/* Local variables -----------------------------------------------------------*/

var server;

/* Methods -------------------------------------------------------------------*/

function listen(done, failure) {
	var cl = K.getComponent('console');
	var config = K.getComponent('config');
	var request = K.getComponent('request');
	
	cl.log('   - Starting http server [ :' + 
		config.connections.http.port +
		' ]');

	if (server) return done();

	server = http.createServer(function(req, res) {
		request.init(_parseArgs(req, res));
	}).listen(config.connections.http.port, done);
}

function send(options, callback) {
	var req = http.request(options, callback);
	req.end();
}

function stop(callback) {
	var cl = K.getComponent('console');
	cl.warn('   - Stopping http server');

	if (server) server.close(callback);
}

function _reply(data, code, contentType) {
	var config = K.getComponent('config');
	var cl = K.getComponent('console');

	if (this.__sent) {
		cl.warn('    http response already sent for ' + this.__path);
		return false;
	}

	this.__sent = true;

	code = code || 200;
	contentType = contentType || config.connections.http.contentType;

	this.writeHead(code, {
		'Content-Type': contentType
	});
	this.end(JSON.stringify(data));
}

function _parseArgs(req, res) {
	res.__path = req.url;
	return frame.create({
		uid: req.uid,
		connection: 'http',
		reply: _reply.bind(res),
		cookies: req.headers.cookie,
		path: req.url,
		headers: req.headers,
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
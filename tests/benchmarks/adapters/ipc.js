/** 
 * KALM Benchmark
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var net = require('net');

var settings = require('../settings'); 

/* Local variables -----------------------------------------------------------*/

var server;
var client;

var count = 0;
var handbreak = true;

/* Methods -------------------------------------------------------------------*/

function _absorb(err) {
	console.log(err);
	return true;
}

function setup(resolve) {
	server = net.createServer(function(socket) {
		socket.on('error', _absorb);
		socket.on('data', function() {
			count++;
		});
	});
	handbreak = false;
	server.on('error', _absorb);
	server.listen('/tmp/app.socket-' + settings.port, resolve);
}

function teardown(resolve) {
	if (client) client.destroy();
	if (server) server.close(function() {
		server = null;
		client = null;
		resolve(count);
	});
}

function stop(resolve) {
	handbreak = true;
	setTimeout(resolve, 0);
}

function step(resolve) {
	if (handbreak) return;
	if (!client) {
		client = net.connect('/tmp/app.socket-' + settings.port);
		client.on('error', _absorb);
	}

	client.write(JSON.stringify(settings.testPayload));
	resolve();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	setup: setup,
	teardown: teardown,
	step: step,
	stop: stop
};
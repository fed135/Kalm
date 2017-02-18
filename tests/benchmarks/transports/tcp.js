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
	return;
}

function setup(resolve) {
	server = net.createServer(function(socket) {
		socket.on('data', function() {
			count++;
		});
		socket.on('error', _absorb);
	});
	handbreak = false;
	server.on('error', _absorb);
	server.listen(settings.port, resolve);
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
		client = net.connect(settings.port, '0.0.0.0');
		client.on('error', _absorb);
	}

	if (client)
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
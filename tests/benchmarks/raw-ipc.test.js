/** 
 * KALM Benchmark
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var net = require('net');

var settings = require('./settings'); 
var Kalm = require('../../index');

/* Local variables -----------------------------------------------------------*/

var server;
var client;

var count = 0;

/* Methods -------------------------------------------------------------------*/

function setup(resolve) {
	server = net.createServer(function(socket) {
		socket.on('data', function() {
			count++;
		});
	});
	server.listen('/tmp/app.socket-' + settings.port, resolve);
}

function teardown(resolve) {
	if (server) server.close();
	server = null;
	client = null;
	resolve(count);
}

function step(resolve) {
	if (!server) return;
	if (!client) {
		client = net.connect('/tmp/app.socket-' + settings.port);
	}

	client.write(JSON.stringify(settings.testPayload));
	resolve();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	setup: setup,
	teardown: teardown,
	step: step
};
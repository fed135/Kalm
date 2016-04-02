/** 
 * KALM Benchmark
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var dgram = require('dgram');

var settings = require('./settings'); 

/* Local variables -----------------------------------------------------------*/

var server;
var client;

var count = 0;

/* Methods -------------------------------------------------------------------*/

function setup(resolve) {
	server = dgram.createSocket('udp4');
	server.on('message', function() {
		count++;
	});
	server.bind(settings.port, '0.0.0.0');
	process.nextTick(resolve);
}

function teardown(resolve) {
	server.close(function() {
		server = null;
		client = null;
		resolve(count);
	});
}

function step(resolve) {
	if (!server) return;
	if (!client) {
		client = dgram.createSocket('udp4');
	}

	var payload = new Buffer(JSON.stringify(settings.testPayload));

	client.send(
		payload, 
		0, 
		payload.length, 
		settings.port, 
		'0.0.0.0'
	);
	resolve();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	setup: setup,
	teardown: teardown,
	step: step
};
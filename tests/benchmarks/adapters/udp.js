/** 
 * KALM Benchmark
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var dgram = require('dgram');

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
	server = dgram.createSocket('udp4');
	server.on('message', function() {
		count++;
	});
	handbreak = false;
	server.on('error', _absorb);
	server.bind(settings.port, '0.0.0.0');
	resolve();
}

function teardown(resolve) {
	server.close(function() {
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
		client = dgram.createSocket('udp4');
		client.on('error', _absorb);
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
	step: step,
	stop: stop
};
/** 
 * KALM Benchmark
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var settings = require('../settings'); 
var Kalm = require('../../../index');

/* Local variables -----------------------------------------------------------*/

var server;
var client;

var count = 0;
var handbreak = true;

/* Methods -------------------------------------------------------------------*/

function setup(resolve) {
	server = Kalm.listen({
		port: settings.port,
		transport: Kalm.transports[settings.transport],
		profile: settings.profile
	});

	server.subscribe(settings.testChannel, function() {
		count++;
	});

	handbreak = false;
	setTimeout(resolve, 0);
}

function teardown(resolve) {
	if (server) server.stop(function() {
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
		client = Kalm.connect({
			port: settings.port, 
			transport: Kalm.transports[settings.transport], 
			profile: settings.profile
		});
	}

	client.write(settings.testChannel, settings.testPayload);
	resolve();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	setup: setup,
	teardown: teardown,
	step: step,
	stop: stop
};
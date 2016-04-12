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
	server = new Kalm.Server({
		port: settings.port,
		adapter: settings.adapter,
		encoder: settings.encoder,
	});

	server.channel(settings.testChannel, function() {
		count++;
	});

	handbreak = false;
	server.on('ready', resolve);
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
		client = new Kalm.Client({
			port: settings.port, 
			adapter: settings.adapter, 
			encoder: settings.encoder,
			bundler: {
				maxPackets: settings.bundlerMaxPackets,
				delay: settings.bundlerDelay
			},
			hostname: '0.0.0.0'
		});
	}

	client.send(settings.testChannel, settings.testPayload);
	resolve();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	setup: setup,
	teardown: teardown,
	step: step,
	stop: stop
};
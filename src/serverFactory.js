/**
 * Kalm bootstraper
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

const profiles = require('./profiles');
const serials = require('./serials');
const transports = require('./transports');

const Multiplex = require('./components/multiplex');
const Server = require('./components/server');

const clientFactory = require('./clientFactory');


/* Methods -------------------------------------------------------------------*/

function create(options) {
	const server = {
		id: crypto.randomBytes(8).toString('hex'),
		port: 3000,
		profile: profiles.dynamic(),
		serial: serials.JSON,
		secretKey: null,
		transport: transports.TCP,
		connections: []
	};

	Object.assign(server,
		options,
		Server(server),
		EventEmitter.prototype
	);

	server.transport.listen(server, options, clientFactory)
		.then(listener => server.listener = listener);

	return server;
}


/* Exports -------------------------------------------------------------------*/

module.exports = { create };
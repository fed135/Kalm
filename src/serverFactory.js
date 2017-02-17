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


/* Methods -------------------------------------------------------------------*/

function create(options) {
	const server = {
		id: crypto.randomBytes(8).toString('hex'),
		port: 3000,
		profile: profiles.dynamic(),
		serial: serials.JSON,
		transport: transports.TCP,
		channels: {},
		connections: []
	};

	Object.assign(server,
		options,
		Multiplex(server),
		Server(server),
		EventEmitter.prototype
	);

	server.transport.listen(server, options)
		.then((listener) => { server.listener = listener; });

	return server;
}


/* Exports -------------------------------------------------------------------*/

module.exports = { create };
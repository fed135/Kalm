/**
 * Client Factory
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

const profiles = require('./profiles');
const serials = require('./serials');
const transports = require('./transports');

const Queue = require('./components/queue');
const Multiplex = require('./components/multiplex');
const Client = require('./components/client');

/* Methods -------------------------------------------------------------------*/

function create(options) {
	const client = {
		port: 3000,
		hostname: '0.0.0.0',
		transport: transports.TCP,
		serial: serials.JSON,
		secretKey: null,
		profile: profiles.dynamic(),
		channels: {},
		backlog: []
	};
	
	Object.assign(client,
		options,
		Multiplex(client),
		Queue(client),
		Client(client),
		EventEmitter.prototype
	);

	client.socket = client.socket || client.transport.createSocket(client);
	client.transport.attachSocket(client.socket, client);
	return client;
}


/* Exports -------------------------------------------------------------------*/

module.exports = { create };
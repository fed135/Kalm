/**
 * Kalm bootstraper
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const clientFactory = require('./clientFactory');
const serverFactory = require('./serverFactory');
const profiles = require('./profiles');
const serials = require('./serials');
const transports = require('./transports');

/* Methods -------------------------------------------------------------------*/

function listen(options) {
	return serverFactory.create(options);
}

function connect(options) {
	return clientFactory.create(options);
}


/* Exports -------------------------------------------------------------------*/

module.exports = { listen, connect, serials, transports, profiles };
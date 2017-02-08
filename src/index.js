/**
 * Kalm bootstraper
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Server = require('./Server');
const Client = require('./Client');
const serials = require('./serials');
const transports = require('./transports');

/* Methods -------------------------------------------------------------------*/

function listen(params) {
	return Server(params);
}

function connect(params) {
	return Client(params);
}


/* Exports -------------------------------------------------------------------*/

module.exports = { listen, connect, serials, transports };
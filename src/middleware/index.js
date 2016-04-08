/**
 * Middleware 
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var bundler = require('./bundler');

/* Local variables -----------------------------------------------------------*/

var list = {
	bundler: bundler
};

/* Methods -------------------------------------------------------------------*/

/**
 * Iterates through a client's transform options and looks for matching
 * middleware transformations
 * @method process
 * @param {Client} client The Kalm Client affected
 * @param {function} emit The method to call to emit a channel's stack
 * @param {string} channel The target channel
 */
function process(client, emit, channel) {
	for (var t in client.options.transform) {
		if (t in list) list[t].process(client, emit, channel);
	}
}

/**
 * Registers a new middleware
 * @method register
 * @param {string} name The name of the middleware
 * @param {object} mod The body of the middleware
 */
function register(name, mod) {
	list[name] = mod;
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	process: process,
	register: register
};
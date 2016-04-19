/**
 * Adapters 
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const debug = require('debug')('kalm');

var list = {};

// If running in the browser, do not load net adapters
if (process.env.NODE_ENV !== 'browser') {
	list.ipc = require('./ipc.adapter');
	list.tcp = require('./tcp.adapter');
	list.udp = require('./udp.adapter');
}

/* Methods -------------------------------------------------------------------*/

/**
 * Returns the selected adapter
 * @method resolve
 * @param {string} name The name of the adapter to return
 * @returns {object|undefined} The adapter
 */
function resolve(name) {
	if (list.hasOwnProperty(name)) {
		return list[name];
	}
	else {
		debug('error: no adapter "' + name + '" found');
		return;
	}
}

/**
 * Registers a new adapter
 * @method register
 * @param {string} name The name of the adapter
 * @param {object} mod The body of the adapter
 */
function register(name, mod) {
	debug('log: registering new adapter "' + name + '":');
	list[name] = mod;
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	resolve: resolve,
	register: register
};
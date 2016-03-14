/**
 * Encoders 
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var json = require('./json');
var msgPack = require('./msg-pack');

var debug = require('debug')('kalm');

/* Local variables -----------------------------------------------------------*/

var list = {
	json: json,
	'msg-pack': msgPack
};

/* Methods -------------------------------------------------------------------*/

/**
 * Returns the selected encoder
 * @method resolve
 * @param {string} name The name of the encoder to return
 * @returns {object|undefined} The encoder
 */
function resolve(name) {
	if (list[name]) {
		return list[name];
	}
	else {
		debug('error: no encoder "' + name + '" found');
		return;
	}
}

/**
 * Registers a new encoder
 * @method register
 * @param {string} name The name of the encoder
 * @param {object} mod The body of the encoder
 */
function register(name, mod) {
	list[name] = mod;
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	resolve: resolve,
	register: register
};
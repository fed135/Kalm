/**
 * Encoders 
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var json = require('./json');
var msgPack = require('./msg-pack');

const debug = require('debug')('kalm');

/* Methods -------------------------------------------------------------------*/

class Encoders {

	/**
	 * Encoders constructor
	 */
	constructor() {
		this.list = {
			json: json,
			'msg-pack': msgPack
		};
	}

	/**
	 * Returns the selected encoder
	 * @param {string} name The name of the encoder to return
	 * @returns {object|undefined} The encoder
	 */
	resolve(name) {
		if (this.list.hasOwnProperty(name)) {
			return this.list[name];
		}
		else {
			debug('error: no encoder "' + name + '" found');
			return;
		}
	}

	/**
	 * Registers a new encoder
	 * @param {string} name The name of the encoder
	 * @param {object} mod The body of the encoder
	 */
	register(name, mod) {
		this.list[name] = mod;
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = new Encoders;
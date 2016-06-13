/**
 * Encoders 
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var json = require('./json');

const debug = require('debug')('kalm');

/* Methods -------------------------------------------------------------------*/

class Encoders {

	/**
	 * Encoders constructor
	 */
	constructor() {
		this.list = {
			json: json
		};
	}

	/**
	 * Returns the selected encoder
	 * @param {string} encoder The name of the encoder to return
	 * @returns {object|undefined} The encoder
	 */
	resolve(encoder) {
		if (this.list.hasOwnProperty(encoder)) {
			return this.list[encoder];
		}
		else {
			debug('error: no encoder "' + encoder + '" found');
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
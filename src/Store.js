/**
 * Store class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const debug = require('debug')('kalm');

/* Methods -------------------------------------------------------------------*/

class Store {

	/**
	 * Store constructor
	 */
	constructor(type) {
		this.type = type;
		this.list = {};
	}

	/**
	 * Returns the selected key
	 * @param {string} name The name of the key to return
	 * @returns {object|undefined} The key
	 */
	resolve(name) {
		if (this.list.hasOwnProperty(name)) {
			return this.list[name];
		}
		else {
			debug('error: no key "' + name + '" found in ' + this.type);
			return;
		}
	}

	/**
	 * Registers a new key
	 * @param {string} name The name of the key
	 * @param {object} mod The body of the key
	 */
	register(name, mod) {
		debug('log: registering new key "' + name + '" in ' + this.type + 's');
		this.list[name] = mod;
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Store;
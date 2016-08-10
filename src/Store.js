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
	constructor(type, template) {
		this.type = type;
		this.list = {};
		this.template = template;
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
		if (this.validate(mod)) {
			this.list[name] = mod;
		}
		else {
			throw new Error(this.type + ' must contain ' + JSON.stringify(
				this.template
			));
		}
	}

	/**
	 * Validate a component against a template
	 * @param {object} template The template to validate against
	 * @param {object} candidate The component to validate
	 * @returns {boolean} Wether the candidate is valid or not
	 */
	 validate(candidate) {
	 	return this.template.every(key => key in candidate);
	 }
}

/* Exports -------------------------------------------------------------------*/

module.exports = Store;
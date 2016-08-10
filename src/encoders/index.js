/**
 * Encoders 
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const json = require('./json');

const Store = require('../Store');

/* Methods -------------------------------------------------------------------*/

class Encoders extends Store {

	/**
	 * Encoders constructor
	 */
	constructor() {
		super('encoder', [
			'encode',
			'decode'
		]);

		this.list.json = json;
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = new Encoders;
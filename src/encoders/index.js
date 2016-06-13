/**
 * Encoders 
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var json = require('./json');

const Store = require('../Store');

/* Methods -------------------------------------------------------------------*/

class Encoders extends Store {

	/**
	 * Encoders constructor
	 */
	constructor() {
		super('encoder');
		this.list.json = json;
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = new Encoders;
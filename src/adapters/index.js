/**
 * Adapters 
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Store = require('../Store');

/* Methods -------------------------------------------------------------------*/

class Adapters extends Store {

	/**
	 * Adapters constructor
	 */
	constructor() {
		super('adapter');

		// If running in the browser, do not load net adapters
		if (process.env.NODE_ENV !== 'browser') {
			this.list.ipc = require('./ipc');
			this.list.tcp = require('./tcp');
			this.list.udp = require('./udp');
		}
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = new Adapters;
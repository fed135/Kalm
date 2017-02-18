/**
 * Adapters 
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Store = require('../Store');

const ipc = require('./ipc');
const tcp = require('./tcp');
const udp = require('./udp');

/* Methods -------------------------------------------------------------------*/

class Adapters extends Store {

	/**
	 * Adapters constructor
	 */
	constructor() {
		super('adapter', [
			'listen',
			'createSocket'
		]);

		this.list.ipc = ipc;
		this.list.tcp = tcp;
		this.list.udp = udp;
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = new Adapters;
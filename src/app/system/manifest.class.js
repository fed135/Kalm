/**
 * Manifest package
 * @exports {component(manifest)}
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

/**
 * Prints the manifest info
 * @method print
 * @returns {object} The manifest info
 */
function print() {
	var system = this.getComponent('system');
	var connection = this.getComponent('connection');
	var config = this.getComponent('config');

	var adapters = Object.keys(connection.adapters).map(function(e) {
		return config.connections[e];
	});

	return {
		id: this.id,
		name: config.pkg.name,
		location: system.location,
		adapters: adapters,
		meta: {
			version: config.pkg.version ,
			description: config.pkg.description || 'A Kalm service.',
			contact: config.pkg.contact || ''
		}
	};
}

/**
 * The entry point for manifest configuration
 * @method main
 * @param {function} callback The callback method
 */
function main(callback) {
	var cl = this.getComponent('console');
	var config = this.getComponent('config');

	cl.log(' - Initializing manifest class');

	process.title = config.pkg.name;
	callback();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'manifest',
	attributes: {
		id: process.pid	
	},
	methods: {
		_init: main,
		print: print
	}
};
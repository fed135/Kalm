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
	var system = K.getComponent('system');
	var connection = K.getComponent('connection');
	var config = K.getComponent('config');

	var adapters = Object.keys(connection.adapters).map(function(e) {
		return config.connections[e];
	});

	return {
		id: this.id,
		name: K.pkg.name,
		location: system.location,
		adapters: adapters,
		meta: {
			version: K.pkg.version ,
			description: K.pkg.description || 'A Kalm service.',
			contact: K.pkg.contact || ''
		}
	};
}

/**
 * The entry point for manifest configuration
 * @method main
 * @param {function} callback The callback method
 */
function main(callback) {
	var cl = K.getComponent('console');

	cl.log(' - Initializing manifest class');

	process.title = K.pkg.name;
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
/**
 * Application events registrar and global events handler
 * @exports {component(events)}
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

/**
 * Entry point for events configuration
 * @method main
 * @param {function} callback The callback method
 */
function main(callback) {
	var cl = K.getComponent('console');

	cl.log(' - Initializing events class');
	
	process.on('SIGINT', terminate);
	process.on('SIGTERM', terminate);

	process.on('uncaughtException', cl.error.bind(cl));

	callback();
}

/**
 * Handles app termination
 * @method terminate
 * @param {function} callback The callback method
 */
function terminate() {
	var connection = K.getComponent('connection');
	var cl = K.getComponent('console');
	var utils = K.getComponent('utils');

	cl.print('\r  ');
	cl.warn('Shutting down...');

	K.onShutdown.dispatch();

	utils.async.all(
		Object.keys(connection.adapters).map(function(e){
			return connection.adapters[e].stop;
		}),
		_kill
	);

	//Just in case something goes bad
	setTimeout(_kill, 1500);
}

/**
 * Force-kills the process
 * @private
 * @method _kill
 */ 
function _kill() {
	process.exit();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	methods: {
		_init: main,
		terminate: terminate
	},
	pkgName: 'events'
};
/**
 * Initializes modules once they are loaded
 * @exports {function} main
 */

'use strict';

/* Local variables -----------------------------------------------------------*/

/** Stores the start time of the node app to calculate boot time */
var _startTime;

/* Methods -------------------------------------------------------------------*/

/**
 * Completes the booting process
 * @private
 * @method _finish
 */
function _finish() {
	var cl = K.getComponent('console');

	cl.log('Server started in ' + (Date.now() - _startTime) + 'ms');
	_startTime = null;
	K.onReady.dispatch();
}

/**
 * Runs the initialization methods (_init) of packages
 * @private
 * @method _runInits
 */
function _runInits() {
	var utils = K.getComponent('utils');
	var cl = K.getComponent('console');

	cl.log(' - Initializing components');

	utils.async.all(K.moduleInits, function(err) {
		if (err) cl.error(err);
		else _finish();
	});
}

/**
 * Prints the Kalm logo
 * @private
 * @method _printLogo
 */
function _printLogo() {
	var cl = K.getComponent('console');
	cl.print(cl.GREEN + '\n	  _\n' +
		'         /\\_\\\n' +
		'        / / /  ' + cl.WHITE + '_' + cl.GREEN + '\n' +
		'       / / /  ' + cl.WHITE + '/\\_\\' + cl.GREEN + '\n' +
		'      / / /' + cl.WHITE + '__/ / /' + cl.GREEN + '\n' +
		'     / /' + cl.WHITE + '\\_____/ /' + cl.GREEN + '\n' +
		'    / /' + cl.WHITE + '\\_______/' + cl.GREEN + '\n' +
		'   / / /' + cl.BLUE + '\\ \\ \\' + cl.GREEN + '\n' +
		'  / / /  ' + cl.BLUE + '\\ \\ \\' + cl.GREEN + '\n' +
		' / / /    ' + cl.BLUE + '\\ \\ \\' + cl.GREEN + '\n' +
		' \\/_/      ' + cl.BLUE + '\\_\\_\\' + cl.WHITE + 
		'    Kalm v' + K.pkg.version + '\n\n');

	cl.log('Starting service...');
	_runInits();
}

/**
 * Applies application config to the base template
 * @private
 * @method _mixinConfigs
 */
function _mixinConfigs() {
	var cl = K.getComponent('console');
	var utils = K.getComponent('utils');
	var config = K.getComponent('config');

	utils.object.mixin(config, K.appConf);
	cl.init();
	_printLogo();
}

/**
 * Entry point for boot process. Triggered once all classes are loaded
 * @method main
 */
function main() {
	_startTime = Date.now();
	_mixinConfigs();
}

/* Exports -------------------------------------------------------------------*/

module.exports = main;
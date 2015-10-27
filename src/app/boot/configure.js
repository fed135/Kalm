/**
 * Initializes modules once they are loaded
 */

/* Requires ------------------------------------------------------------------*/

/* Local variables -----------------------------------------------------------*/

var _tasks = [
	_mixinConfigs,
	_printLogo,
	_runInits,
	_finish
];

/* Methods -------------------------------------------------------------------*/

/**
 * Entry point for boot process. Triggered once all classes are loaded
 * @method main
 */
function main() {
	var cl = K.getComponent('console');
	var utils = K.getComponent('utils');

	var _startTime = Date.now();

	utils.async.all(_tasks, function(err) {
		if (err) {
			cl.error('Boot failure: ');
			cl.error(err);
		}
		else {
			cl.log('Server started in ' + (Date.now() - _startTime) + 'ms');
		}
	});
}

/*
*/
function _runInits(resolve, failure) {
	var utils = K.getComponent('utils');
	var cl = K.getComponent('console');

	cl.log(' - Initializing components');

	utils.async.all(K.moduleInits, function(err) {
		if (err) failure(err);
		else resolve();
	});
}

/*
*/
function _mixinConfigs(resolve) {
	var cl = K.getComponent('console');
	var utils = K.getComponent('utils');
	var config = K.getComponent('config');

	utils.object.mixin(config, K.appConf);
	cl.init();
	resolve();
}

/*
*/
function _printLogo(resolve) {
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
  resolve();
}

/*
*/
function _finish(resolve) {
	var cl = K.getComponent('console');

  cl.log('Ready!\n');
  K.onReady.dispatch();
  resolve();
}

/* Exports -------------------------------------------------------------------*/

module.exports = main;
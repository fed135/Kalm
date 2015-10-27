var Signal = require('signals');

function main(callback) {
	var cl = K.getComponent('console');

	cl.log(' - Initializing events class');
	
	process.on('SIGINT', terminate);
	process.on('SIGTERM', terminate);
}

//TODO: Look for app-state patterns - move this there
function terminate(callback) {
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

function _kill() {
	process.exit();
}

module.exports = {
	methods: {
		_init: main,
		terminate: terminate
	},
	pkgName: 'events'
};
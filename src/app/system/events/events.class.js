var Signal = require('signals');

function main(callback) {
	var cl = K.getComponent('console');

	cl.log(' - Initializing events class');
	
	process.on('SIGINT', terminate);
	process.on('SIGTERM', terminate);

	K.onRequest = new Signal();
	K.onBeforeShutdown = new Signal();
}

//TODO: Look for app-state patterns - move this there
function terminate(callback) {
	var connection = K.getComponent('connection');
	var cl = K.getComponent('console');
	var utils = K.getComponent('utils');

  cl.print('\r  ');
	cl.warn('Shutting down...');

	utils.async.all(
		Object.keys(connection.adapters).map(function(e){
			return connection.adapters[e].stop;
		}),
		_kill
	);

	//Just in case something goes bad
	setTimeout(_kill, 1000);
}

function _kill() {
	process.exit();
}

module.exports = {
	methods: {
		_init: main
	},
	pkgName: 'events'
};
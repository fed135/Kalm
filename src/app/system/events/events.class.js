var Signal = require('signals');

function main(callback) {
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

	var servers = [];
  cl.print('\r  ');
	cl.warn('Shutting down...');

	connection.listeners.forEach(function(e) {
		servers.push(e.stop);
	});

	utils.async.all(servers, _kill);

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
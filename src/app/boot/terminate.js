function onTerminate(callback) {
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
	setTimeout(_kill, 2000);
}

function _kill() {
	process.exit();
}

module.exports = onTerminate;
function onTerminate(callback) {
	var connection = K.getComponent('connection');
	var cl = K.getComponent('console');
	var utils = K.getComponent('utils');

	var servers = [];
  cl.print('\r ');
	cl.warn('Shutting down...');

	connection.listeners.forEach(function(e) {
		servers.push(e.stop);
	});

	utils.async.all(servers, function() {
		process.exit();
	});
}

module.exports = onTerminate;
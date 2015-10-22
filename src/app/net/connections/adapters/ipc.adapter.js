/**
 * InterProcessCall connector methods
 * @adapter ipc
 * @exports {object}
 */

/* Requires ------------------------------------------------------------------*/

var ipc = require('ipc-light');

/* Local variables -----------------------------------------------------------*/

var server; /** {ipc.Server|null} The ipc server for this process

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for ipc connections on the selected port.
 * socket connections are created with a friend (which is created if not 
 * already present)
 * @method listen
 * @param {function} done The success callback for the operation
 * @param {function} failure The error callback for the operation
 */
function listen(done, failure) {
	var config = K.getComponent('config');
	var request = K.getComponent('request');
	var manifest = K.getComponent('manifest');
	var cl = K.getComponent('console');

	cl.log('   - Starting ipc server  [ :i' + manifest.id + ' ]');

	config.connections.ipc.port = 'i' + manifest.id;

	server = ipc.createServer(function(req, reply) {
		request.init(null, _parseArgs(req, reply));
	}).listen(config.connections.ipc.path + 'i' + manifest.id, done);
}

/**
 * Re-uses or creates a socket client to communicate with another service
 * @method send
 * @param {Friend} friend The friend service to send to
 * @param {object} options The details of the request
 * @param {ipc.Client|null} socket The socket to use
 * @param {function|null} callback The callback method
 */
function send(friend, options, socket, callback) {
	var config = K.getComponent('config');

	if (socket === null) {
		socket = ipc.connect({
			path: config.connections.ipc.path + friend.port
		});
		socket.ondisconnect.add(function() {
			var i = friend.__pool.indexOf(socket);
			if (i !== -1) friend.__pool.splice(i, 1);
		});
	}

	socket.emit(options);

	if (friend.poolSize > friend.__pool.length) {
		friend.__pool.push(socket);

		socket.ondata.add(function (err, data) {
			request.init(socket, _parseArgs(data, null));
		});
	}
	else socket.disconnect();
	if (callback) callback();
}

function stop(callback) {
	var cl = K.getComponent('console');
	cl.warn('   - Stopping ipc server');
	
	if (server) server.close(callback);
}

function _parseArgs(req, res) {
	return frame.create({
		uid: req.uid,
		connection: 'ipc',
		reply: res,
		path: req.path,
		method: req.method,
		payload: req.body
	});
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	name: 'ipc',
	autoload: true,
	listen: listen,
	send: send,
	stop: stop
};
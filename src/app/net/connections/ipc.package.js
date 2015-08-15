/**
 * InterProcessCall connector methods
 */

/* Requires ------------------------------------------------------------------*/

var ipc = require('node-ipc');	//TODO: fork node-ipc
ipc.config.silent = true;

//Remove colors, add debug, clear architecture, lint

/* Methods -------------------------------------------------------------------*/

function listen(done, failure) {
	var config = K.getComponent('config');
	var request = K.getComponent('request');
	
	ipc.serve(config.connections.ipc.path, function() {
		ipc.server.on(config.connections.ipc.evt, function(data) {
			request.init(data);
		});
		done();
	});
	ipc.server.define.listen[config.connections.ipc.evt]='This event type listens for message strings as value of data key.';

	ipc.server.start();
}

function send(options, message, callback) {
	var _self = this;

	if (!ipc.of.local) {
		ipc.connectTo('local', config.connections.ipc.path, function() {
			_self.send(options, message, callback);
		});
		return;
	}

	options.payload = message;

	ipc.of.local.emit(config.connections.ipc.evt, options, callback);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send
};
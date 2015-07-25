//var io = require('node-zmq');
var net = require('net');

function initializeIPC(callback) {
	var config = K.getComponent('config');
	var _self = this;

	//Creating...
	this.ipc_connection = net.createServer(function(socket) {
		_self.ipc_socket = socket;
		callback();
	});
	this.ipc_connection.listen(config.ipc.path);

	//Connecting...
	this.ipc_connection = net.createConnection('/path/to/socket');
	this.ipc_connection.on('connect', function(socket) {
    console.log('connected to unix socket server');
	});

	//Sending...
	socket.write();
}

module.exports = {

};
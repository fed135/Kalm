/**
 * InterProcessCall connector methods
 * @adapter ipc
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var net = require('net');
var fs = require('fs');

/* Methods -------------------------------------------------------------------*/

IPC.defaultPath = '/tmp/app.socket-';

/**
 * IPC adapter
 * @constructor
 * @param {Kalm} K The Kalm instance
 */
function IPC(options, handler) {
	this.options = options;
	this.handler = handler;
	this.server = null;
}

/**
 * Listens for ipc connections on the selected port.
 * @method listen
 * @memberof IPC
 * @param {object} options The config object for that adapter
 * @param {function} handler The central handling method for requests
 * @param {function} callback The success callback for the operation
 */
IPC.prototype.listen = function(callback) {
	var _self = this;

	fs.unlink(this.path, function bindSocket() {
		_self.server = net.createServer(_self.handler);
		_self.server.listen(IPC.defaultPath + _self.options.port, callback);
	});
};

/**
 * Sends a message with a socket client, then pushes it back to its peer
 * @method send
 * @memberof IPC
 * @param {Buffer} payload The body of the request
 * @param {Socket} socket The socket to use
 */
IPC.prototype.send = function(socket, payload) {
	socket.write(payload);
};

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @memberof IPC
 * @param {Service} peer The peer to create the socket for
 * @returns {Socket} The created ipc client
 */
IPC.prototype.createClient = function(peer, handler) {
	return net.connect(IPC.defaultPath + this.options.port);
};

/**
 * Calls the disconnect method on a socket
 * @method removeClient
 * @memberof IPC
 * @param {Socket} socket The socket to disconnect
 */
IPC.prototype.removeClient = function(socket) {
	socket.disconnect();
};

/**
 * Stops listening for ipc connections and closes the server
 * @method stop
 * @memberof IPC
 * @param {function|null} callback The callback method
 */ 
IPC.prototype.stop = function(callback) {
	if (this.server) this.server.close(callback);
	else callback();
};

/* Exports -------------------------------------------------------------------*/

module.exports = IPC;
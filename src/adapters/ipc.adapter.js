/**
 * InterProcessCall connector methods
 * @adapter ipc
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var ipc = require('ipc-light');

/* Methods -------------------------------------------------------------------*/

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
	this.server = ipc.createServer(this.handler)
		.listen(ipc.defaults.path + '-' + this.options.port, callback);
};

/**
 * Sends a message with a socket client, then pushes it back to its peer
 * @method send
 * @memberof IPC
 * @param {Buffer} payload The body of the request
 * @param {Socket} socket The socket to use
 * @param {function|null} callback The callback method
 */
IPC.prototype.send = function(payload, socket, callback) {
	this.client.emit(payload, callback || function() {});
};

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @memberof IPC
 * @param {Service} peer The peer to create the socket for
 * @returns {ipc.Client} The created ipc client
 */
IPC.prototype.createClient = function(peer, handler) {
	var socket = ipc.connect({
		path: ipc.defaults.path + '-' + peer.options.port
	});

	socket.ondisconnect.add(this.destroy.bind(this));
	socket.onerror.add(this.destroy.bind(this));
	socket.ondata.add(handler);

	return socket;
};

/**
 * Calls the disconnect method on a socket
 * @method removeClient
 * @memberof IPC
 * @param {Socket} socket The socket to disconnect
 */
IPC.prototype.removeClient = function() {
	this.client.disconnect();
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
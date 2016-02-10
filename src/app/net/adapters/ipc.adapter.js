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
function IPC(K) {
	this.type = 'ipc';
	this.server = null;
	this.path = '/tmp/socket-';	// Target an ssd device when available 
}

/**
 * Listens for ipc connections on the selected port.
 * @method listen
 * @memberof IPC
 * @param {object} options The config object for that adapter
 * @param {function} handler The central handling method for requests
 * @param {function} callback The success callback for the operation
 */
IPC.prototype.listen = function(options, handler, callback) {
	var _self = this;
	this.server = ipc.createServer(function(req) {
		handler(req, _self);
	}).listen(this.path + options.port, callback);
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
	socket.client.emit(payload, callback || function() {});
};

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @memberof IPC
 * @param {object} options The config object for that adapter
 * @param {Service} peer The peer to create the socket for
 * @returns {ipc.Client} The created ipc client
 */
IPC.prototype.createClient = function(peer, channel, handler) {
	var _self = this;

	console.log('connecting ipc socket to ' + JSON.stringify(peer.options));

	var socket = ipc.connect({
		path: this.path + peer.options.port
	});

	socket.ondisconnect.add(channel.destroy.bind(channel));
	socket.onerror.add(channel.destroy.bind(channel));

	socket.ondata.add(function(req) {
		handler(req, _self, peer);
	});

	return socket;
};

/**
 * Calls the disconnect method on a socket
 * @method removeClient
 * @memberof IPC
 * @param {Socket} socket The socket to disconnect
 */
IPC.prototype.removeClient = function(socket) {
	socket.client.disconnect();
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
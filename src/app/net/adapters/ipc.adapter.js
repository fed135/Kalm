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
	}).listen(options.path + options.port, callback);
};

/**
 * Sends a message with a socket client, then pushes it back to its peer
 * @method send
 * @memberof IPC
 * @param {Service} peer The peer to send to
 * @param {Buffer} payload The body of the request
 * @param {Socket} socket The socket to use
 * @param {function|null} callback The callback method
 */
IPC.prototype.send = function(peer, payload, socket, callback) {
	socket.client.emit(payload, function() {
		if (!peer._pushSocket(socket)) {
			socket.client.disconnect();
		}

		if (callback) callback();
	});
};

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @memberof IPC
 * @param {object} options The config object for that adapter
 * @param {Service} peer The peer to create the socket for
 * @returns {ipc.Client} The created ipc client
 */
IPC.prototype.createClient = function(options, peer) {
	var socket = ipc.connect({
		path: options.path + peer.port
	});

	socket.ondisconnect.add(function() {
		peer._removeSocket(socket);
	});

	socket.onerror.add(function() {
		peer._removeSocket(socket);
	});

	return socket;
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
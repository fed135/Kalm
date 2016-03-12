/**
 * InterProcessCall connector methods
 * @adapter tcp
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var net = require('net');

/* Methods -------------------------------------------------------------------*/

/**
 * TCP adapter
 * @constructor
 * @param {Kalm} K The Kalm instance
 */
function TCP(options, handler) {
	this.options = options;
	this.handler = handler;
	this.server = null;
}

/**
 * Listens for tcp connections on the selected port.
 * @method listen
 * @memberof TCP
 * @param {function} callback The success callback for the operation
 */
TCP.prototype.listen = function(callback) {
	this.server = net.createServer(this.handler)
		.listen(this.options.port, callback);
};

/**
 * Sends a message with a socket client
 * @method send
 * @memberof TCP
 * @param {Buffer} payload The body of the request
 * @param {Socket} socket The socket to use
 * @param {function|null} callback The callback method
 */
TCP.prototype.send = function(payload, socket, callback) {
	socket.write(payload, callback);
};

/**
 * Creates a client
 * @method createClient
 * @memberof TCP
 * @param {Client} client The client to create the socket for
 * @returns {Socket} The created tcp client
 */
TCP.prototype.createClient = function(client) {
	return net.connect(this.options.port);
};

/**
 * Calls the disconnect method on a socket
 * @method removeClient
 * @memberof TCP
 * @param {Socket} socket The socket to disconnect
 */
TCP.prototype.removeClient = function(socket) {
	socket.disconnect();
};

/**
 * Stops listening for ipc connections and closes the server
 * @method stop
 * @memberof TCP
 * @param {function|null} callback The callback method
 */ 
TCP.prototype.stop = function(callback) {
	if (this.server) this.server.close(callback);
	else callback();
};

/* Exports -------------------------------------------------------------------*/

module.exports = TCP;
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
function TCP(K) {
	this.type = 'tcp';
	this.server = null;
}

/**
 * Listens for tcp connections on the selected port.
 * @method listen
 * @memberof TCP
 * @param {object} options The config object for that adapter
 * @param {function} handler The central handling method for requests
 * @param {function} callback The success callback for the operation
 */
TCP.prototype.listen = function(options, handler, callback) {
	var _self = this;
	this.server = net.createServer(function(req) {
		req.on('data', function(data) {
			handler(data, _self);
		});
		
	}).listen(options.port, callback);
};

/**
 * Sends a message with a socket client, then pushes it back to its peer
 * @method send
 * @memberof TCP
 * @param {Service} peer The peer to send to
 * @param {Buffer} options The details of the request
 * @param {Socket} socket The socket to use
 * @param {function|null} callback The callback method
 */
TCP.prototype.send = function(peer, options, socket, callback) {
	socket.client.write(options, function() {
		if (!peer._pushSocket(socket)) {
			socket.client.destroy();
		}

		if (callback) callback();
	});
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

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @memberof TCP
 * @param {object} options The config object for that adapter
 * @param {Service} peer The peer to create the socket for
 * @returns {Socket} The created tcp client
 */
TCP.prototype.createClient = function(options, peer) {
	var socket = net.connect(peer);

	socket.on('disconnect', function() {
		peer._removeSocket(socket);
	});

	socket.on('error', function() {
		if (socket && socket.disconnect) {
			socket.disconnect();
		}
		peer._removeSocket(socket);
	});
	return socket;
};

/* Exports -------------------------------------------------------------------*/

module.exports = TCP;
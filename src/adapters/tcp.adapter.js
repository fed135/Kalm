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
 * @param {object} options The config object for that adapter
 * @param {function} handler The central handling method for requests
 * @param {function} callback The success callback for the operation
 */
TCP.prototype.listen = function(callback) {
	var _self = this;
	this.server = net.createServer(function(req) {
		req.on('error', function(err) { console.log(err); });
		req.on('connect', function() { console.log('connect'); });
		req.on('disconnect', function() { console.log('disconnect'); });
		req.on('data', _self.handler);
	}).listen(this.options.port, callback);
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
TCP.prototype.send = function(payload, socket, callback) {
	socket.client.write(payload, callback || function(){});
};

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @memberof TCP
 * @param {object} options The config object for that adapter
 * @param {Service} peer The peer to create the socket for
 * @returns {Socket} The created tcp client
 */
TCP.prototype.createClient = function(peer, handler) {
	var socket = net.connect(peer.options);

	socket.on('data', handler);
	socket.on('disconnect', this.destroy.bind(this));
	socket.on('error', this.destroy.bind(this));

	return socket;
};

/**
 * Calls the disconnect method on a socket
 * @method removeClient
 * @memberof TCP
 * @param {Socket} socket The socket to disconnect
 */
TCP.prototype.removeClient = function() {
	this.client.disconnect();
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
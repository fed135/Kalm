/**
 * InterProcessCall connector methods
 * @adapter udp
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var dgram = require('dgram');

/* Methods -------------------------------------------------------------------*/

/**
 * UDP adapter
 * @constructor
 * @param {Kalm} K The Kalm instance
 */
function UDP(options, handler) {
	this.options = options;
	this.handler = handler;
	this.server = null;
}

/**
 * Listens for udp connections on the selected port.
 * @method listen
 * @memberof UDP
 * @param {object} options The config object for that adapter
 * @param {function} handler The central handling method for requests
 * @param {function} callback The success callback for the operation
 */
UDP.prototype.listen = function(callback) {
	var _self = this;
	this.server = dgram.createSocket('udp4');
	this.server.on('message', this.handler);
	this.server.bind(this.options.port, '127.0.0.1');
	if (callback) callback();
};

/**
 * Sends a message with a socket client, then pushes it back to its peer
 * @method send
 * @memberof UDP
 * @param {Service} peer The peer to send to
 * @param {Buffer} options The details of the request
 * @param {Socket} socket The socket to use
 * @param {function|null} callback The callback method
 */
UDP.prototype.send = function(payload, socket, callback) {
	socket.client.send(
		payload, 
		0, 
		payload.length, 
		this.peer.options.port, 
		this.peer.options.hostname, 
		callback || function() {}
	);
};

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @memberof UDP
 * @param {object} options The config object for that adapter
 * @param {Service} peer The peer to create the socket for
 * @returns {dgram.Socket} The created udp client
 */
UDP.prototype.createClient = function(peer, handler) {
	var socket = dgram.createSocket('udp4');

	return socket;
};

/**
 * Calls the disconnect method on a socket
 * @method removeClient
 * @memberof UDP
 * @param {Socket} socket The socket to disconnect
 */
UDP.prototype.removeClient = function() {
	this.client.disconnect();
};

/**
 * Stops listening for udp connections and closes the server
 * @method stop
 * @memberof UDP
 * @param {function|null} callback The callback method
 */ 
UDP.prototype.stop = function(callback) {
	if (this.server) this.server.close(callback);
	else callback();
};

/* Exports -------------------------------------------------------------------*/

module.exports = UDP;
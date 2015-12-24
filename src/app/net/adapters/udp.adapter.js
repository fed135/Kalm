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
function UDP(K) {
	this.type = 'udp';
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
UDP.prototype.listen = function(options, handler, callback) {
	var _self = this;
	this.server = dgram.createSocket('udp4');
	this.server.on('message', function (req) {
		handler(req, _self);
	});
	this.server.bind(options.port, '127.0.0.1');
	callback();
};

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @memberof UDP
 * @param {object} options The config object for that adapter
 * @param {Service} peer The peer to create the socket for
 * @returns {dgram.Socket} The created udp client
 */
UDP.prototype.createClient = function(options, peer) {
	var socket = dgram.createSocket('udp4');
	socket.__active = true;

	return socket;
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
UDP.prototype.send = function(peer, options, socket, callback) {
	socket.client.send(
		options, 
		0, 
		options.length, 
		peer.port, 
		peer.hostname, 
		function(err, bytes) {
			if (err !== 0 || bytes !== options.length) {
				socket.client.close();
				socket.client.__active = false;
			}
			else {
				if (!peer._pushSocket(socket)) {
					socket.client.close();
					socket.client.__active = false;
				}
			}

			if (callback) callback();
		}
	);
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
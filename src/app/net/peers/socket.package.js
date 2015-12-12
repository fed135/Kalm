/**
 * Socket class
 * @class Socket
 * @exports {Socket}
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

/**
 * Socket constructor
 * @constructor
 * @param {object} options The configuration options for the socket
 */
function Socket(options) {
	var net = this.p.components.net;

	this.label = options.label;
	this.service = options.service;

	this.client = net.createClient(options.service);

	this.timeout = options.timeout || -1;
}

/**
 * Sends a request with the socket
 * @method send
 * @memberof Socket
 * @param {*} payload The payload to send
 * @param {function} callback The callback method
 */
Socket.prototype.send = function(payload, callback) {
	var net = this.p.components.net;

	connection.send(this.service, payload, this, callback);
	return this;
};

/**
 * Destroys the socket instance - async
 * @method destroy
 * @memberof Socket
 */
Socket.prototype.destroy = function() {
	//TODO: make sure that all clients implement disconnect
	this.client.disconnect();
};

/* Exports -------------------------------------------------------------------*/

module.exports = Socket;
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
	this.label = options.channel || options.label;
	this.service = options.service;

	this.client = null;

	this.timeout = options.timeout || -1;
}

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
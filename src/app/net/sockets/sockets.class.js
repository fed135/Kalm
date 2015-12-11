/**
 * Sockets package
 * @exports {Sockets}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Socket = require('./socket.package');

/* Methods -------------------------------------------------------------------*/

/**
 * Sockets class
 * @constructor
 * @param {Kalm} K Kalm reference
 * @param {function} callback The callback method
 */
function Sockets(K, callback) {
	this.p = K;

	if (callback) callback();
}

/**
 * Creates a socket
 * @method create
 * @param {string|null} name The name for the socket
 * @param {object|null} options The options for the socket
 * @returns {Socket} The created socket
 */
Sockets.prototype.create = function(name, options) {
	var utils = this.p.components.utils;
	var s;

	options = options || {};
	options.label = name || utils.crypto.generate();

	s = new Socket(options);
	s.p = this.p;

	return s;
};

/* Exports -------------------------------------------------------------------*/

module.exports = Sockets;
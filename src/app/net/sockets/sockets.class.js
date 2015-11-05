/**
 * Sockets package
 * @exports {component(sockets)}
 */

'use strict'

/* Requires ------------------------------------------------------------------*/

var Socket = require('./socket.package');

/* Methods -------------------------------------------------------------------*/

/**
 * Creates a socket
 * @method create
 * @param {string|null} name The name for the socket
 * @param {object|null} options The options for the socket
 * @returns {Socket} The created socket
 */
function create(name, options) {
	var utils = K.getComponent('utils');
	options = options || {};
	options.label = name || utils.crypto.generate();
	return new Socket(options);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'sockets',
	methods: {
		create: create
	}
};
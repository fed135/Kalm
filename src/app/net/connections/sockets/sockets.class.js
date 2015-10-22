/**
 * Sockets package
 * @exports {package(sockets)}
 */

'use strict'

/* Requires ------------------------------------------------------------------*/

var Socket = require('./socket.package');

/* Local variables -----------------------------------------------------------*/

/* Methods -------------------------------------------------------------------*/

function create(name, options) {
	options = options || {};
	options.label = name;
	return new Socket(options);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'sockets',
	methods: {
		create: create
	}
};
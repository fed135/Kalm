/**
 * Utility packages
 * @exports {component(utils)}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var object = require('./object.package');
var async = require('./async.package');
var crypto = require('./crypto.package');

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'utils',
	attributes: {
		object: object,
		async: async,
		crypto: crypto
	}
};
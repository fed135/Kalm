/**
 * Utility packages
 */

/* Requires ------------------------------------------------------------------*/  

var object = require('./object.package');
var async = require('./async.package');
var loader = require('./loader.package');
var crypto = require('./crypto.package');

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'utils',
	attributes: {
		loader: loader,
		object: object,
		async: async,
		crypto: crypto
	}
};
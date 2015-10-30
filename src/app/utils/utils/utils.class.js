/**
 * Utility packages
 */

/* Requires ------------------------------------------------------------------*/  

var object = require('./object.package');
var async = require('./async.package');
//TODO: find a better require query
var loader = require('../../boot/loader');
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
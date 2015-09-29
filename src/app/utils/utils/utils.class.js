/**
 * Utility packages
 */

/* Requires ------------------------------------------------------------------*/  

var object = require('./object.package');
var async = require('./async.package');
var loader = require('./loader.package');

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'utils',
	attributes: {
		loader: loader,
		object: object,
		async: async
	}
};
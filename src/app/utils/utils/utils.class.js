/**
 * Utility packages
 */

/* Requires ------------------------------------------------------------------*/  

var object = require('./object.package');
var async = require('./async.package');

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'utils',
	attributes: {
		object: object,
		async: async
	}
};
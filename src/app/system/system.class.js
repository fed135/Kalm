/**
 * System info package
 * @exports {component(system)}
 */

'use_strict';

/* Requires ------------------------------------------------------------------*/

var os = require('os');

/* Methods -------------------------------------------------------------------*/

/**
 * The entry point for the systems analysis package
 * @method main
 * @param {function} callback The callback method
 */
function main(callback) {
	var _defaultAddress = '127.0.0.1';
	var _currAddress = null;
	var interfaces = os.networkInterfaces();
	var cl = this.getComponent('console');

	cl.log(' - Initializing system class');

	Object.keys(interfaces).forEach(function(i) {
		interfaces[i].forEach(function(e) {
			if (!_currAddress) {
				if (e.family === 'IPv4' && !e.internal) {
					_currAddress = e.address;
				}
			}
		});
	});

	this.location = _currAddress || _defaultAddress;
	this.arch = os.arch();
	this.platform = os.platform();

	callback();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'system',
	attributes: {},
	methods: {
		_init: main
	}
};
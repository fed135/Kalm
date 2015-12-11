/**
 * System info package
 * @exports {System}
 */

'use_strict';

/* Requires ------------------------------------------------------------------*/

var os = require('os');

/* Methods -------------------------------------------------------------------*/

/**
 * System class
 * @constructor
 * @param {Kalm} K Kalm reference
 * @param {function} callback The callback method
 */
function System(K, callback) {
	this.p = K;

	var _defaultAddress = '127.0.0.1';
	var _currAddress = null;
	var interfaces = os.networkInterfaces();
	var cl = this.p.components.console;

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

	if (callback) callback();
}

/* Exports -------------------------------------------------------------------*/

module.exports = System;
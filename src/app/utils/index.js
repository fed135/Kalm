/**
 * Utility packages
 * @exports {Utils}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var crypto = require('./crypto');

/* Methods  ------------------------------------------------------------------*/

/**
 * Utils class
 * @constructor
 * @param {Kalm} K Kalm reference
 * @param {function} callback The callback method
 */
function Utils(K, callback) {
	this.p = K;
	this.crypto = crypto;

	if (callback) callback(this);
}

/* Exports -------------------------------------------------------------------*/

module.exports = Utils;
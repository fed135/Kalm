/**
 * class @profiles
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

function dynamic(options) {
	return Object.assign({
		tick: 16,
		maxBytes: 1400
	}, options || {});
}

function heartbeat(options) {
	return Object.assign({
		tick: 16,
		maxBytes: null
	}, options || {});
}

function threshold(options) {
	return Object.assign({
		tick: null,
		maxBytes: 1400
	}, options || {});
}

function manual() {
	return { tick: null, maxBytes: null };
}

/* Exports -------------------------------------------------------------------*/

module.exports = { dynamic, heartbeat, threshold, manual };
/**
 * Object utility methods
 * @exports {object}
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

/**
 * Performs a simple, non-reccursive mixin
 * @method mixin
 * @param {object} target The receiving object
 * @param {object} source The giving object
 * @returns {object} The target object with the mixed data
 */
function mixin(target, source) {
	// Non-reccursive broken thing
	/*
	Object.getOwnPropertyNames(source).forEach(function(key) {
		Object.defineProperty(
			target, 
			key, 
			Object.getOwnPropertyDescriptor(source, key)
		); 
	});
	*/
	// Reccursive ugly thing
	for(var i in source) {
		if (typeof target[i] === 'object') {
			target[i] = mixin(target[i], source[i]);
		}
		else {
			target[i] = source[i];
		}
	}

	return target;
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	mixin: mixin
};
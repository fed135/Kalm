/**
 * Crypto utils
 * @exports {object}
 */

'use strict'

/* Methods -------------------------------------------------------------------*/

/**
 * Generates a unique id
 * @method generate
 * @returns {string} The generated unique id
 */
function generate() {
	//TODO: proper uid generation
	return (Math.random()*10000).toString();	
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	generate: generate
};
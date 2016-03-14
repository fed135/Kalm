/**
 * JSON Encoder 
 * @encoder json
 * @exports {object}
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

/**
 * Encodes a payload
 * @method encode
 * @param {object} payload The payload to encode
 * @returns {Buffer} The encoded payload
 */
function encode(payload) {
	return new Buffer(JSON.stringify(payload));
}

/**
 * Decodes a payload
 * @method decode
 * @param {Buffer} payload The payload to decode
 * @returns {object} The decoded payload
 */
function decode(payload) {
	return JSON.parse(payload.toString());
}


/* Exports -------------------------------------------------------------------*/

module.exports = {
	encode: encode,
	decode: decode
};
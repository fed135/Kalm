/**
 * Encoder Commons
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

class Encoder {
	/**
	 * Encodes a payload
	 * @placeholder
	 * @param {object} payload The payload to encode
	 * @returns {Buffer} The encoded payload
	 */
	encode() {
		throw new Error('not implemented');
	}

	/**
	 * Decodes a payload
	 * @placeholder
	 * @param {Buffer} payload The payload to decode
	 * @returns {object} The decoded payload
	 */
	decode() {
		throw new Error('not implemented');
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Encoder;
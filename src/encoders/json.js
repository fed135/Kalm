/**
 * JSON Encoder 
 * @module encoders/json
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

class JSONEncoder {

	/**
	 * Encodes a payload
	 * @param {object} payload The payload to encode
	 * @returns {Buffer} The encoded payload
	 */
	static encode(payload) {
		return new Buffer(JSON.stringify(payload));
	}

	/**
	 * Decodes a payload
	 * @param {Buffer} payload The payload to decode
	 * @returns {object} The decoded payload
	 */
	static decode(payload) {
		return JSON.parse(payload.toString());
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = JSONEncoder;
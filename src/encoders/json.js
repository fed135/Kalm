/**
 * JSON Encoder 
 * @module encoders/json
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Encoder = require('./common');

/* Methods -------------------------------------------------------------------*/

class JSONEncoder extends Encoder {

	/**
	 * JSON encoder constructor
	 */
	constructor() {
		super('json');
	}

	/**
	 * Encodes a payload
	 * @param {object} payload The payload to encode
	 * @returns {Buffer} The encoded payload
	 */
	encode(payload) {
		return new Buffer(JSON.stringify(payload));
	}

	/**
	 * Decodes a payload
	 * @param {Buffer} payload The payload to decode
	 * @returns {object} The decoded payload
	 */
	decode(payload) {
		return JSON.parse(String.fromCharCode.apply(null, payload));
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = new JSONEncoder;
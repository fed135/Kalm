/**
 * MSGPACK Encoder 
 * @module encoders/msg-pack
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const msgDecode = require('msgpack-decode');
const msgPack = require('msgpack-lite');

/* Methods -------------------------------------------------------------------*/

/**
 * Encodes a payload
 * @param {object} payload The payload to encode
 * @returns {Buffer} The encoded payload
 */
function encode(payload) {
	return msgPack.encode(payload);
}

/**
 * Decodes a payload
 * @param {Buffer} payload The payload to decode
 * @returns {object} The decoded payload
 */
function decode(payload) {
	return msgDecode(payload);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	encode: encode,
	decode: decode
};
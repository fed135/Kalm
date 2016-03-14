/**
 * MSGPACK Encoder 
 * @encoder msg-pack
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var msgDecode = require('msgpack-decode');
var msgPack = require('msgpack-lite');

/* Methods -------------------------------------------------------------------*/

/**
 * Encodes a payload
 * @method encode
 * @param {object} payload The payload to encode
 * @returns {Buffer} The encoded payload
 */
function encode(payload) {
	return msgPack.encode(payload);
}

/**
 * Decodes a payload
 * @method decode
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
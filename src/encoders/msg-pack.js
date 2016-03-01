var msgDecode = require('msgpack-decode');
var msgPack = require('msgpack-lite');

function encode(payload) {
	return msgPack.encode(payload);
}

function decode(payload) {
	return msgDecode(payload);
}

module.exports = {
	encode: encode,
	decode: decode
};

function encode(payload) {
	return new Buffer(JSON.stringify(payload));
}

function decode(payload) {
	return JSON.parse(payload.toString());
}

module.exports = {
	encode: encode,
	decode: decode
};
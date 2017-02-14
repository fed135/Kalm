/**
 * Serializer
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

function serialize(frame, channel, packets) {
	let result = [frame, channel.length];

	for (let letter = 0; letter < channel.length; letter++) {
		result.push(channel.charCodeAt(letter));
	}

	packets.forEach((packet) => {
		result = result.concat(
			uint16_size(packet.length), 
			Array.prototype.slice.call(packet)
		);
	});

	result.push(10);

	return Buffer.from(result);
}

function uint16_size(value) {
	return [value >>> 8, value & 0xff];
}

function numeric_size(a, b) {
	return (a << 8) | b;
}

function deserialize(payload) {
	const result = {
		frame: payload[0],
		channel: '',
		payload_bytes: payload.length,
		packets: []
	};

	const letters = [];
	const channel_len = payload[1];
	let caret = channel_len + 2;

	for (let letter = 2; letter < channel_len + 2; letter++) {
		letters.push(payload[letter]);
	}
	result.channel = String.fromCharCode.apply(null, letters);

	while(caret < result.payload_bytes) {
		let packet_len = numeric_size(payload[caret], payload[caret + 1]);
		let packet = [];
		for (let byte = caret + 2; byte < packet_len + caret + 2; byte++) {
			packet.push(payload[byte]);
		}
		result.packets.push(packet);

		caret = caret + packet_len + 2;
	}

	return result;
}

/* Exports -------------------------------------------------------------------*/

module.exports = { serialize, deserialize };
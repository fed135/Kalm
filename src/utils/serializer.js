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
			uint16Size(packet.length), 
			Array.prototype.slice.call(packet)
		);
	});

	result.push(10);

	return Buffer.from(result);
}

function uint16Size(value) {
	return [value >>> 8, value & 0xff];
}

function numericSize(a, b) {
	return (a << 8) | b;
}

function deserialize(payload) {
	const result = {
		frame: payload[0],
		channel: '',
		payloadBytes: payload.length,
		packets: []
	};

	const letters = [];
	const channelLength = payload[1];
	let caret = channelLength + 2;

	for (let letter = 2; letter < channelLength + 2; letter++) {
		letters.push(payload[letter]);
	}
	result.channel = String.fromCharCode.apply(null, letters);

	while(caret < result.payloadBytes) {
		let packetLength = numericSize(payload[caret], payload[caret + 1]);
		let packet = [];
		for (let byte = caret + 2; byte < packetLength + caret + 2; byte++) {
			packet.push(payload[byte]);
		}
		result.packets.push(packet);

		caret = caret + packetLength + 2;
	}

	return result;
}

/* Exports -------------------------------------------------------------------*/

module.exports = { serialize, deserialize };
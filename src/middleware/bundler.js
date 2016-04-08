/**
 * Packet bundler
 * @middleware bundler
 * @exports {object}
 */

'use strict';

/* Methods -------------------------------------------------------------------*/

/**
 * Processes a new packet marked for sending
 * Bundling is performed over channels separatly
 * @method process
 * @param {Client} client The Kalm Client affected
 * @param {function} emit The method to call to emit a channel's stack
 * @param {string} channel The target channel
 */
function process(client, emit, channel) {
	var options = client.options.transform.bundler || {};

	if (!client.__bundler) {
		client.__bundler = {
			timers: {}
		};
	}

	if (client.packets[channel].length > options.maxPackets || 512) {
		if (client.__bundler.timers[channel]) {
			clearTimeout(client.__bundler.timers[channel]);
		}
		emit(channel);
		return;
	}

	if (!client.__bundler.timers[channel]) {
		client.__bundler.timers[channel] = setTimeout(
			function _emitBundle() {
				emit(channel);
			}, 
			options.delay || 16		// 60 FPS
		);
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	process: process
};
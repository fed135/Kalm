/**
 * Default properties for new Clients/ Servers
 */

'use strict'

/* Exports -------------------------------------------------------------------*/

module.exports = {
	hostname: '0.0.0.0',
	port: 3000,
	adapter: 'tcp',
	encoder: 'json',
	stats: false,
	tick: null,
	socketTimeout: 1000 * 30,	// 30 seconds
	bundler: {
		maxPackets: 2048,
		serverTick: false,
		delay: 16,
		splitBatches: true
	}
};
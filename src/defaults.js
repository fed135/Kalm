/**
 * Default properties for new Clients/ Servers
 */

'use strict'

/* Exports -------------------------------------------------------------------*/

module.exports = {
	hostname: '0.0.0.0',
	port: 3000,
	adapter: 'tcp',
	encoder: 'msg-pack',
	transform: {
		bundler: {
			maxPackets: 512,
			delay: 16
		}
	}
};
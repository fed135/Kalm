/**
 * Default configuration options
 * @exports {component(config)}
 */

'use strict';

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'config',
	attributes: {
		environment: 'dev',
		mock: false,
		debug: {
			noColor: false
		},
		connections: {
			ipc: {
				port: 4001,
				evt: 'message',
				path: '/tmp/socket-'
			},
			tcp: {
				port: 5001
			},
			udp: {
				port: 6001
			}
		}
	}
};
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
			poolSize: -1,
			ipc: {
				evt: 'message',
				path: '/tmp/'
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
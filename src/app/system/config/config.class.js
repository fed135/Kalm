module.exports = {
	pkgName: 'config',
	attributes: {
		debug: {
			//noColor: true
		},
		poolSize: 2,
		connections: {
			ipc: {
				evt: 'message',
				path: '/tmp/'
			},
			http: {
				port: 3001,
				contentType: 'text/json'
			},
			zmq: {
				port: 4001,
				evt: 'KalmZMQ'
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
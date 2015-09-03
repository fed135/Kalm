module.exports = {
	pkgName: 'config',
	attributes: {
		debug: {
			//noColor: true
		},
		connections: {
			ipc: {
				evt: 'message',
				path: '/var/local/socket/kalm.socket'
			},
			http: {
				port: 3000
			}
		}
	}
};
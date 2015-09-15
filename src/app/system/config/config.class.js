module.exports = {
	pkgName: 'config',
	attributes: {
		debug: {
			//noColor: true
		},
		connections: {
			ipc: {
				evt: 'message',
				path: '/tmp/'
			},
			http: {
				port: 3001,
				contentType: 'text/json'
			}
		}
	}
};
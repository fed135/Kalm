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
				port: 3000,
				contentType: 'text/json'
			}
		}
	}
};
module.exports = {
	pkgName: 'config',
	attributes: {
		connections: {
			ipc: {
				evt: 'message',
				path: '/var/local/socket/kalm.socket'
			}
		}
	}
};
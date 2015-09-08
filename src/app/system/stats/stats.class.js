var os = require('os');

//add process stats

module.exports = {
	pkgName: 'stats',
	methods: {
		freemem: os.freemem,
		totalmem: os.totalmem,
		loadavg: os.loadavg,
		uptime: os.uptime
	}
};
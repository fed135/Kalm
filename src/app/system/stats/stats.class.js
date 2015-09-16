var os = require('os');

//TODO: put behind functions, cache result for config.healthcheckRate
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
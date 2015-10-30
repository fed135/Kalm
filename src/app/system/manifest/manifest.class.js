function print() {
	var config = K.getComponent('config');
	var models = K.getComponent('models');
	var routes = K.getComponent('routes');

	return {
		id: this.id,
		name: K.pkg.name,
		//location: config.server.location,
		//port: config.server.port,
		models: models.print(),
		routes: routes.print(),
		meta: {
			version: K.pkg.version ,
			description: K.pkg.description || 'A Kalm service.',
			contact: K.pkg.contact || ''
		}
	};
}

function main(callback) {
	var cl = K.getComponent('console');

	cl.log(' - Initializing manifest class');

	process.title = K.pkg.name;
	callback();
}

module.exports = {
	pkgName: 'manifest',
	attributes: {
		id: process.pid	
	},
	methods: {
		_init: main,
		print: print
	}
};
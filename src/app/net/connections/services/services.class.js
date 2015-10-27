/**
 * Services package
 * @exports {package(services)}
 */

'use strict'

/* Requires ------------------------------------------------------------------*/

var Service = require('./service.package');

/* Local variables -----------------------------------------------------------*/

/* Methods -------------------------------------------------------------------*/

function create(name, options) {
	name || utils.crypto.generate();
	options = options || Object.create(null);

	var cl = K.getComponent('console');
	var utils = K.getComponent('utils');
	var connection = K.getComponent('connection');
	var circles = K.getComponent('circles');
	var adapter = connection.adapters[options.adapter || 'ipc'];
	var cl = K.getComponent('console');

	var f;
	var cList;

	if (options.circles === undefined) options.circles = [];
	if (options.poolSize === undefined) options.poolSize = adapter.poolSize;
	options.label = name;

	f = new Service(options);
	cList = options.circles.concat([utils.crypto.generate()]);
	cList.forEach(function(c) {
		circles.find(c).add(f);
	});
	return f;
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'services',
	methods: {
		create: create
	}
};
/**
 * Services package
 * @exports {package(services)}
 */

'use strict'

/* Requires ------------------------------------------------------------------*/

var Service = require('./service.package');

/* Local variables -----------------------------------------------------------*/

var _list = {};					//Remote hosts or services

/* Methods -------------------------------------------------------------------*/

function get(name, options) {
	var cl = K.getComponent('console');
	var utils = K.getComponent('utils');
	var connection = K.getComponent('connection');
	var adapter = connection.adapters[options.adapter];
	var cl = K.getComponent('console');
	var f;

	//TODO: check what to do with uniqueness
	if (_list[name]) {
		return _list[name];
	}

	//TODO: check if we should force tcp
	if (!adapter) {
		cl.error('Unable to create service with adapter ' + options.adapter);
	}

	if (options.poolSize === undefined) options.poolSize = adapter.poolSize;
	if (!options.circles) options.circles = [];
	options.circles.push(utils.crypto.generate());
	//TODO: add to circles - make them live in circles, not in _list!

	f = new Service(options);
	_list[name] = f;
	return f;
}

function remove(name) {
	var f = _list[name];
	
	//TODO: remove from circles
	delete _list[name];
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'services',
	methods: {
		remove: remove,
		get: get
	}
};
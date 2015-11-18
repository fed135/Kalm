/**
 * Services package
 * @exports {component(services)}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Service = require('./service.package');

/* Local variables -----------------------------------------------------------*/

var _handlers = null;

/* Methods -------------------------------------------------------------------*/

/**
 * Creates a service
 * @method create
 * @param {string} name The name for the service
 * @param {object} options The options for the service
 * @return {Service} The created service
 */
function create(name, options) {
	var utils = K.getComponent('utils');
	var connection = K.getComponent('connection');
	var circles = K.getComponent('circles');

	name = name || utils.crypto.generate();
	options = options || Object.create(null);

	var adapter = connection.adapters[options.adapter || 'ipc'];
	var f;
	var cList;

	if (options.circles === undefined) options.circles = [];
	if (options.poolSize === undefined) options.poolSize = adapter.poolSize;
	options.label = name;

	f = new Service(options);
	cList = options.circles.concat(['global']);
	cList.forEach(function(c) {
		circles.find(c).add(f);
	});
	_bindServiceHandler(f);
	return f;
}

/**
 * Tries to bind a service to a handler
 * @private
 * @method _bindServiceHandler
 * @param {Service} service The service to bind a handler to
 */
function _bindServiceHandler(service) {
	if (_handlers !== null) {
		if (service.label in _handlers) {
			service.onRequest.add(_handlers[service.label]);
		}
	}
}

/**
 * Adds a collection of handlers to bind to new and existing services
 * @method bindHandlers
 * @param {object} handlers The collection of handlers for the app
 */
function bindHandlers(handlers) {
	_handlers = handlers;

	var circles = K.getComponent('circles');
	circles.find('global').all().forEach(_bindServiceHandler);
}

/**
 * Entry point for services class. Instantiates services listed in the config.
 * @method main
 * @param {function} callback The callback method
 */
function main(callback) {
	var config = K.getComponent('config');

	if (config.services) {
		Object.keys(config.services).forEach(function(e){
			create(e, config.services[e]);
		});
	}

	callback();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'services',
	methods: {
		create: create,
		bindHandlers: bindHandlers,
		_init: main
	}
};
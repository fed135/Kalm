/**
 * Connection class
 * This is the regroupement of all the i/o adapters.
 * @exports {component(connection)}
 */

'use strict';

/* Local variables -----------------------------------------------------------*/

/** Wrapper for the payloads */
var callWrapper = {
	origin: {
		h: '0.0.0.0',
		p: 80
	},
	meta: {
		sId: '',
		id: ''
	}
};

var _defaultHandler = function(){};

/* Methods -------------------------------------------------------------------*/

/**
 * Loads an adapter
 * @method loadAdapter
 * @param {object} adapter The adapter object to load (adapter definition)
 * @param {function} callback The callback method
 */
function loadAdapter(adapter, callback) {
	this.adapters[adapter.name] = adapter;
	adapter.listen(callback);
}

/**
 * Sets the default controller for routes
 * @method setDefaultHandler
 * @param {function} handler The function to call on routes
 */
function setDefaultHandler(handler) {
	_defaultHandler = handler;
}  

/**
 * Entry point for the configuration of adapter connections
 * @method main
 * @param {function} callback The callback method
 */
function main(callback) {
	var utils = K.getComponent('utils');
	var cl = K.getComponent('console');
	var manifest = K.getComponent('manifest');

	var self = this;
	var baseAdapters = ['ipc', 'tcp', 'udp'];

	cl.log(' - Initializing connections class');
	
	utils.async.all(baseAdapters.map(function(adapter) {
		return function(resolve) {
			var adapterPkg = require('./adapters/' + adapter + '.adapter');
			loadAdapter.call(self, adapterPkg, resolve);
		};
	}), callback);

	callWrapper.meta.id = K.pkg.name + '#' + manifest.id;
}

/**
 * Interface for client creation, redirects to proper adapter
 * @method createClient
 * @param {Service} service The service to create a client for
 * @returns {object|null} The created client or null on error
 */
function createClient(service) {
	if (!(service.adapter in this.adapters)) return null;

	return this.adapters[service.adapter].createClient(service);
}

/**
 * Interface for client validation, redirects to proper adapter
 * @method isConnected
 * @param {Service} service The service object
 * @param {Socket} socket The socket to validate
 * @returns {boolean} Wether the socket is valid or not
 */
function isConnected(service, socket) {
	if (!(service.adapter in this.adapters)) return false;

	return this.adapters[service.adapter].isConnected(socket);
}

/**
 * Interface for client sending method, redirects to proper adapter
 * @method send
 * @param {Service} service The service to create a client for
 * @param {?} payload The payload to send
 * @param {Socket} socket The socket to use
 * @param {function} callback The callback method 
 */
function send(service, payload, socket, callback) {
	var config = K.getComponent('config');
	var system = K.getComponent('system');

	if (!(service.adapter in this.adapters)) {
		return callback('Unknown type "' + service.adapter + '"');
	}

	callWrapper.origin.h = system.location;
	callWrapper.origin.p = config.connections[service.adapter].port;
	callWrapper.meta.sId = service.label;
	callWrapper.payload = payload;

	this.adapters[service.adapter].send(service, callWrapper, socket, callback);
}

/**
 * Global capture method for incomming requests.
 * Redirects to the appropriate service's handling method 
 * @method handleRequest
 * @param {object} req The incomming request payload
 * @param {function} reply The reply interface
 */
function handleRequest(req, reply) {
	var circles = K.getComponent('circles');
	var system = K.getComponent('system');
	var config = K.getComponent('config');
	var service;

	if (!req.meta) {
		_defaultHandler(req);
		return;
	}

	//Check if it's the same service that sent the request
	if (req.origin) {
		if (
			req.origin.p === config.connections[req.origin.adapter].port &&
			req.origin.h === system.location
		) { 
			//It's from me
			return;
		}
	}

	service = circles.find('global').service(req.meta.sId, req.origin, true);

	if (service.onRequest.getNumListeners() > 0) {
		service.onRequest.dispatch(req, reply);
	}
	else {
		_defaultHandler(req, reply);
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'connection',
	attributes: {
		adapters: {}
	},
	methods: {
		_init: main,
		load: loadAdapter,
		createClient: createClient,
		handleRequest: handleRequest,
		setDefaultHandler: setDefaultHandler,
		send: send,
		isConnected: isConnected
	}
};
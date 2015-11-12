/**
 * Connection class
 * This is the regroupement of all the i/o adapters.
 * @exports {component(connection)}
 */

/* Requires ------------------------------------------------------------------*/

var ipc = require('./adapters/ipc.adapter.js');
var tcp = require('./adapters/tcp.adapter.js');
var udp = require('./adapters/udp.adapter.js');

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
	if (!service.adapter in this.adapters) {
		return callback('Unknown type "' + service.adapter + '"');
	}

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
	if (!service.adapter in this.adapters) {
		cl.warn('Unknown type "' + service.adapter + '"');
		return false;
	}

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

	if (!service.adapter in this.adapters) {
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
	//TODO: what to do in the case of an unwrapped request
	if (!req.meta) {
		K.onRequest.dispatch(req);
		return;
	}

	var circles = K.getComponent('circles');
	circles.find('global')
		.service(req.meta.sId, req.origin, true)
		.onRequest.dispatch(req, reply);
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
		send: send,
		isConnected: isConnected
	}
};
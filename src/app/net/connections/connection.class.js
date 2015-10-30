/**
 * Connection class
 * This is the regroupement of all the i/o adapters.
 */

/* Requires ------------------------------------------------------------------*/

/* Local variables -----------------------------------------------------------*/

var callWrapper = {
	origin: {
		hostname: '0.0.0.0',
		port: 80,
		keepAlive: true
	},
	metadata: {
		serviceId: '',
		name: '',
		id: ''
	}
};

/* Methods -------------------------------------------------------------------*/

/**
 *
 */
function loadAdapter(adapter, path, callback) {
	this.adapters[adapter.name] = adapter;
	//TODO: services.has instead of routes
	if (adapter.autoload/* || routes.has(adapter.name)*/) {
		adapter.listen(callback);
	}
	else callback();
}

function main(callback) {
	var utils = K.getComponent('utils');
	var cl = K.getComponent('console');
	var manifest = K.getComponent('manifest');

	cl.log(' - Initializing connections class');
	utils.loader.load('./src/app/net/connections/adapters', '.adapter.js', loadAdapter.bind(this), callback);
	callWrapper.metadata.id = manifest.id;
	callWrapper.metadata.name = K.pkg.name;
}

function createClient(service) {
	if (!service.adapter in this.adapters) {
		return callback('Unknown type "' + service.adapter + '"');
	}

	return this.adapters[service.adapter].createClient(service);
}

function isConnected(service, socket) {
	if (!service.adapter in this.adapters) {
		cl.warn('Unknown type "' + service.adapter + '"');
		return false;
	}

	return this.adapters[service.adapter].isConnected(socket);
}

function send(service, payload, socket, callback) {
	var config = K.getComponent('config');
	var system = K.getComponent('system');

	if (!service.adapter in this.adapters) {
		return callback('Unknown type "' + service.adapter + '"');
	}

	callWrapper.origin.hostname = system.location;
	callWrapper.origin.port = config.connections[service.adapter].port;
	callWrapper.origin.keepAlive = service.keepAlive;
	callWrapper.metadata.serviceId = service.label;
	callWrapper.payload = payload;

	this.adapters[service.adapter].send(service, callWrapper, socket, callback);
}

function handleRequest(req) {
	var circles = K.getComponent('circles');
	circles.find('global')
		.service(req.metadata.serviceId, req.origin, true)
		.onRequest.dispatch(req);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'connection',
	attributes: {
		adapters: []
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
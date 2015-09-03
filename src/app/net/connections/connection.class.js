/**
 * Connection class
 * This is the regroupement of all the i/o adapters.
 *
 * LISTEN:
 * http/https: only gatekeeper + listed route
 * tcp: only gatekeeper + listed route
 * udp: only gatekeeper + listed route
 * zmq: everyone
 * ipc: everyone(?)
 */

/* Requires ------------------------------------------------------------------*/

var http = require('./http.package');
var ipc = require('./ipc.package');
var tcp = require('./tcp.package');
var udp = require('./udp.package');
var zmq = require('./zmq.package');
var socket = require('./socket.package');

/* Local variables -----------------------------------------------------------*/

var connectors = {
	http: http,
	ipc: ipc,
	tcp: tcp,
	udp: udp,
	zmq: zmq
};

/* Methods -------------------------------------------------------------------*/

function main(callback) {

	var routes = K.getComponent('routes');
	var utils = K.getComponent('utils');

	var listeners = [];

	//listeners.push(zmq.listen);
	//listeners.push(ipc.listen);

	if (routes.has('http')) listeners.push(http.listen);
	if (routes.has('tcp')) listeners.push(tcp.listen);
	if (routes.has('udp')) listeners.push(udp.listen);

	utils.async.all(listeners, callback)
}

function send(type, options, payload, callback) {
	if (!type in _connectors) return callback('Unknown type "' + type + '"');

	connectors[type].send(options, payload, callback);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'connection',
	methods: {
		init: main,
		send: send
	}
};
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

	var servers = [];

	//this.listeners.push(zmq.listen);
	this.listeners.push(ipc);

	if (routes.has('http')) this.listeners.push(http);
	if (routes.has('tcp')) this.listeners.push(tcp);
	if (routes.has('udp')) this.listeners.push(udp);

	this.listeners.forEach(function(e) {
		servers.push(e.listen)
	});

	utils.async.all(servers, callback)
}

function send(type, options, callback) {
	if (!type in connectors) return callback('Unknown type "' + type + '"');

	connectors[type].send(options, callback);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'connection',
	attributes: {
		listeners: []
	},
	methods: {
		_init: main,
		send: send
	}
};
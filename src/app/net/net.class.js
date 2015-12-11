/**
 * Net class
 * This is the regroupement of all the i/o adapters and their wrapping methods
 * @exports {Net}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var decode = require('msgpack-decode');
var msgpack = require('msgpack-lite');

/* Methods -------------------------------------------------------------------*/

/**
 * Net class
 * @constructor
 * @param {Kalm} K Kalm reference
 * @param {function} callback The callback method
 */
function Net(K, callback) {
	this.p = K;

	var utils = this.p.components.utils;
	var config = this.p.config;
	var cl = this.p.components.cl;

	var baseAdapters = ['ipc', 'tcp', 'udp'];
	var _self = this;

	this.adapters = {};

	this.callWrapper = {
		origin: { h: '0.0.0.0', p: 80 },
		meta: { sId: '', id: config.pkg.name + '#' + manifest.id }
	};

	cl.log(' - Initializing connections class');
	
	utils.async.all(baseAdapters.map(function(adapter) {
		return function(resolve) {
			var adapterPkg = require('./adapters/' + adapter + '.adapter');
			_self.loadAdapter.call(_self, adapterPkg, resolve);
		};
	}), callback);
}

/**
 * Loads an adapter
 * @method loadAdapter
 * @memberof Net
 * @param {object} adapter The adapter object to load (adapter definition)
 * @param {function} callback The callback method
 */
Net.prototype.loadAdapter = function(adapter, callback) {
	var config = this.p.config;
	var cl = this.p.components.console;

	cl.log(
		'   - Starting ' + adapter.name + ' server' + 
		' [ :' + config.connections[adapter.name].port + ' ]'
	);

	this.adapters[adapter.name] = adapter;
	adapter.listen(
		config.connections[adapter.name], 
		this.handleRequest.bind(this), 
		callback
	);
};

/**
 * Interface for client creation, redirects to proper adapter
 * @method createClient
 * @param {Service} peer The peer to create a client for
 * @returns {object|null} The created client or null on error
 */
Net.prototype.createClient = function(peer) {
	var config = this.p.config;

	if (!(peer.adapter in this.adapters)) return null;

	return this.adapters[peer.adapter].createClient(
		config.connections[peer.adapter], 
		peer
	);
};

/**
 * Interface for client sending method, redirects to proper adapter
 * @method send
 * @param {Service} peer The peer to create a client for
 * @param {?} payload The payload to send
 * @param {Socket} socket The socket to use
 * @param {function} callback The callback method 
 */
Net.prototype.send = function(peer, payload, socket, callback) {
	var config = this.p.config;
	var system = this.p.components.system;

	if (!(peer.adapter in this.adapters)) {
		return callback('Unknown type "' + peer.adapter + '"');
	}

	this.callWrapper.origin.h = system.location;
	this.callWrapper.origin.p = config.connections[peer.adapter].port;
	this.callWrapper.meta.sId = peer.label;
	this.callWrapper.payload = payload;

	this.adapters[peer.adapter].send(peer, this.callWrapper, socket, callback);
}

/**
 * Global capture method for incomming requests.
 * Redirects to the appropriate peer's handling method 
 * @method handleRequest
 * @param {object} req The incomming request payload
 * @param {function} reply The reply interface
 */
function handleRequest(req, server) {
	var config = this.p.config;
	var peer;
	var reply;
	var _self = this;

	req = decode(req);

	if (!req.payload) req = { payload: req };
	if (!req.origin) req.origin = {};
	req.origin.adapter = server.type;

	if (req.meta) {
		peer = peers.find(req.meta.sId, req.origin, true);

		reply = function(payload, callback) {
			// Service existing or created during handleRequest
			var socket = peer.socket();
			_self.send.call(_self, peer, payload, socket, callback);
		}

		if (peer.onRequest.getNumListeners() > 0) {
			peer.onRequest.dispatch(req, reply);
			return true;
		}
	}

	// Not captured by any peer, no packet info - should drop
	// cl.warn('Unhandled request');
}

/* Exports -------------------------------------------------------------------*/

module.exports = Net;
/**
 * Peers package
 * @exports {Peers}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Peer = require('./peer');

/* Methods -------------------------------------------------------------------*/

/**
 * Peers class
 * @constructor
 * @param {Kalm} K Kalm reference
 * @param {function} callback The callback method
 */
function Peers(K, callback) {
	var config;

	this._list = {};
	this._handlers = {};
	this.p = K;

	config = this.p.config;

	if (config.peers) {
		Object.keys(config.peers).forEach(function(e){
			this.create(e, config.peers[e]);
		}, this);
	}

	if (callback) callback(this);
}

/**
 * Creates a peer
 * @method create
 * @memberof Peers
 * @param {string} name The name for the peer
 * @param {object} options The options for the peer
 * @return {Peer} The created peer
 */
Peers.prototype.create = function(name, options) {
	var utils = this.p.components.utils;
	var net = this.p.components.net;
	var console = this.p.components.console;

	var f;

	if (!name) {
		console.error('Name is required for new Peer');
		return;
	}

	options = options || {};

	if (options.circles === undefined) options.circles = [];
	options.label = name;

	options.circles = options.circles.concat(['global']);
	f = new Peer(this.p, options);
	this._bindPeerHandler(f);
	this._list[f.label] = f;
	return f;
};

/**
 * Recovers a peer by label
 * @method find
 * @memberof Peers
 * @param {string} label The label of the peer to find
 * @returns {Peer|undefined} The requested peer, if found.
 */
Peers.prototype.find = function(label) {
	return this._list[label];
};

/**
 * Recovers a list of peers belonging to a circle
 * @method from
 * @memberof Peers
 * @param {string} circle The name of the circle to get the peers from
 * @returns {array} The list of peers from the requested circle 
 */
Peers.prototype.from = function(circle) {
	var self = this;
	return Object.keys(this._list)
		.filter(function(e) {
			return self._list[e].circles.includes(circle);
		})
		.map(function(e) {
			return self._list[e];
		});
};

/**
 * Tries to bind a peer to a handler
 * @private
 * @method _bindPeerHandler
 * @memberof Peers
 * @param {Peer} peer The peer to bind a handler to
 */
Peers.prototype._bindPeerHandler = function(peer) {
	if (this._handlers !== null) {
		if (peer.label in this._handlers) {
			//peer.onRequest.add(this._handlers[peer.label]);
		}
		else {
			if ('default' in this._handlers) {
				//peer.onRequest.add(this._handlers['default']);
			}
		}
	}
};

/**
 * Adds a collection of handlers to bind to new and existing peers
 * @method bindHandlers
 * @memberof Peers
 * @param {object} handlers The collection of handlers for the app
 */
Peers.prototype.bindHandlers = function(handlers) {
	var _self = this;

	if (!handlers) return;
	if (!handlers.length) handlers = [handlers];

	handlers.forEach(function(e) {
		Object.keys(e).forEach(function(h) {
			_self._handlers[h] = e[h];
		});
	});

	for(var i in this._list) {
		this._bindPeerHandler(this._list[i]);
	}
};

/* Exports -------------------------------------------------------------------*/

module.exports = Peers;
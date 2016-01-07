/**
 * Peer class
 * @class Peer
 * @exports {Peer}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Signal = require('signals');
var Socket = require('./socket.package');

/* Methods -------------------------------------------------------------------*/

/**
 * Peer constructor
 * @constructor
 * @param {object} options The configuration options for the peer
 */
function Peer(options) {
	this.label = options.label;
	this.hostname = options.hostname || '0.0.0.0';
	this.adapter = options.adapter || 'ipc';
	this.port = options.port || 80;
	this.poolSize = options.poolSize || -1;
	this.socketTimeout = options.socketTimeout || -1;

	this._pool = [];
	this._namedSockets = {};

	this.onRequest = new Signal();
}

/**
 * Recovers or create a socket for the peer
 * @method socket
 * @memberof Peer
 * @param {string|null} name The name of the socket. If none, will pool
 * @param {object|null} options The options for the socket
 * @returns {Socket} The recovered or created socket
 */
Peer.prototype.socket = function(name, options) {
	var self = this;
	var s;

	options = options || Object.create(null);
	options.peer = this;

	//Unnamed sockets - use pooling system
	if (!name) {
		if (this._pool.length > 0) s = this._pool.shift();
		else {
			s = new Socket(options);
			this.p.components.net.createClient(s, this);
		}

		if (this.socketTimeout !== -1) {
			s.__timeout = setTimeout(function() {
				s.__dead = true;
			}, this.socketTimeout);
		}

		return s;
	}
	else {
		if (name in this._namedSockets) {
			return this._namedSockets[name];
		}

		options.label = name;
		this._namedSockets[name] = new Socket(options);
		this.p.components.net.createClient(this._namedSockets[name], this);
		return this._namedSockets[name];
	}
};

Peer.prototype.send = function(payload, options, callback) {
	var net = this.p.components.net;
	net.send(this, payload, options, callback);
};

/**
 * Recovers or create a socket for the peer
 * @system-reserved
 * @method _pushSocket
 * @memberof Peer
 * @param {Socket} socket The socket to re-introduce
 * @returns {boolean} Wether the socket was re-pooled or not
 */
Peer.prototype._pushSocket = function(socket) {
	//Named sockets dont get moved.
	if (!(socket.label in this._namedSockets)) {
		if (this.poolSize > this._pool.length || this.poolSize === -1) {
			if (this.socketTimeout !== -1) {
				if (socket.__dead) return false;
				else clearTimeout(socket.__timeout);
			}
			this._pool.push(socket);
			return true;
		}
		return false;
	}
	return true;
};

/**
 * Removes the socket from the pool
 * @system-reserved
 * @method _removeSocket
 * @memberof Peer
 * @param {Socket} socket The socket to remove
 */
Peer.prototype._removeSocket = function(socket) {
	var i;

	if (socket.label in this._namedSockets) {
		delete this._namedSockets[socket.label];
	}
	else {
		for (i = this._pool.length - 1; i >= 0; i--) {
			if (this._pool[i].label === socket.label) {
				this._pool.splice(i,1);
				return;
			}
		}
	}
};

/* Exports -------------------------------------------------------------------*/

module.exports = Peer;
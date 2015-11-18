/**
 * Service class
 * @class Service
 * @exports {Service}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Signal = require('signals');

/* Methods -------------------------------------------------------------------*/

/**
 * Service constructor
 * @constructor
 * @param {object} options The configuration options for the service
 */
function Service(options) {
	var config = K.getComponent('config');

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
 * Recovers or create a socket for the service
 * @method socket
 * @memberof Service
 * @param {string|null} name The name of the socket. If none, will pool
 * @param {object|null} options The options for the socket
 * @returns {Socket} The recovered or created socket
 */
Service.prototype.socket = function(name, options) {
	var sockets = K.getComponent('sockets');
	var connection = K.getComponent('connection');
	var self = this;
	var s;

	options = options || Object.create(null);
	options.service = this;

	//Unnamed sockets - use pooling system
	if (!name) {
		//Make sure pooled sockets are still connected
		this._pool = this._pool.filter(function(socket) {
			return connection.isConnected(self, socket);
		});

		if (this._pool.length > 0) s = this._pool.shift();
		else s = sockets.create(null, options);

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

		this._namedSockets[name] = sockets.create(name, options);
		return this._namedSockets[name];
	}
};

/**
 * Recovers or create a socket for the service
 * @system-reserved
 * @method _pushSocket
 * @memberof Service
 * @param {Socket} socket The socket to re-introduce
 * @returns {boolean} Wether the socket was re-pooled or not
 */
Service.prototype._pushSocket = function(socket) {
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
 * @memberof Service
 * @param {Socket} socket The socket to remove
 */
Service.prototype._removeSocket = function(socket) {
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

module.exports = Service;
/**
 * Service class
 * @class Service
 * @exports {Service}
 */

'use strict'

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
	this.poolSize = (options.poolSize !== undefined)?options.poolSize:config.poolSize;
	this.keepAlive = (options.keepAlive !== undefined)?options.keepAlive:true;
	this.wrap = (options.wrap !== undefined)?options.wrap:true;

	this._pool = [];
	this._namedSockets = {};
	this.filters = [];

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
	var utils = K.getComponent('utils');
	var connection = K.getComponent('connection');
	var i = 0;
	var self = this;

	options = options || Object.create(null);
	options.service = this;

	//Unnamed sockets - use pooling system
	if (!name) {
		//Make sure pooled sockets are still connected
		this._pool = this._pool.filter(function(socket) {
			return connection.isConnected(self, socket);
		});

		if (this._pool.length > 0) return this._pool.shift();
		else return sockets.create(null, options);
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
		if (this.poolSize > this._pool.length) {
			this._pool.push(socket);
			return true;
		}
		return false;
	}
	return true;
};

/**
 * Updates the connected status of a socket
 * @system-reserved
 * @method _updateSocketStatus
 * @memberof Service
 * @param {Socket} socket The socket to update
 */
Service.prototype._updateSocketStatus = function(socket) {
	//TODO:
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

	if (socket.label in this._namedSockets) delete this._namedSockets[socket.label];
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
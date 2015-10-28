/**
 * Service class
 * @class Service
 * @exports {Service}
 */

'use strict'

/* Requires ------------------------------------------------------------------*/

var Signal = require('signals');

/* Methods -------------------------------------------------------------------*/

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

Service.prototype.socket = function(name, options) {
	var sockets = K.getComponent('sockets');
	var utils = K.getComponent('utils');
	var i = 0;

	options = options || Object.create(null);
	options.service = this;

	//Unnamed sockets - use pooling system
	if (!name) {
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
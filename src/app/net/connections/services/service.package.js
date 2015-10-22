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
	this.adapter = options.adapter;
	this.port = options.port || 80;
	this.poolSize = (options.poolSize !== undefined)?options.poolSize:config.poolSize;
	this.keepAlive = (options.keepAlive !== undefined)?options.keepAlive:true;
	this.wrap = (options.wrap !== undefined)?options.wrap:true;

	this._pool = [];
	this._namedSockets = {};
}

Service.prototype.socket = function(name, options) {
	var sockets = K.getComponent('sockets');
	var utils = K.getComponent('utils');
	var i = 0;

	if (options) {
		options.serviceId = this.label;
	}

	//Unnamed sockets - use pooling system
	if (!name) {
		if (this._pool.length > 0) return this._pool.shift();
		else return sockets.create(null, options);
	}
	else {
		if (name in this._namedSockets) {
			return this._namedSockets[name];
		}

		if (!options) return null;

		this._namedSockets[name] = sockets.create(name, options);
		return this._namedSockets[name];
	}
};

/* Exports -------------------------------------------------------------------*/

module.exports = Service;
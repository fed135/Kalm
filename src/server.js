/**
 * Server class
 * @class Server
 * @exports {Server}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var debug = require('debug')('kalm');
var Signal = require('signals');

var adapters = require('./adapters');
var encoders = require('./encoders');

/* Methods -------------------------------------------------------------------*/

/**
 * Server constructor
 * @constructor
 * @param {object} options The configuration options for the server
 */
function Server(options) {
	options = options || {};

	this.status = 'off';
	this.options = {
		adapter: options.adapter || 'ipc',
		encoder: options.encoder || 'json',
		port: options.port || 80
	};

	this.onReady = new Signal();

	if (this.options.adapter in adapters) {
		this._server = new adapters[this.options.adapter](this.options, this._handleRequest.bind(this));
	}
	else {
		// Custom adapter
		this._server = new this.options.adapter(this.options, this._handleRequest);
	}
}

/**
 * Server lift
 * @method
 * @memberof Server
 */
Server.prototype.listen = function(callback) {
	var _self = this;
	if (this._server) {
		this._server.listen(callback);
	}
};

Server.prototype.stop = function() {
	if (this._server) this._server.stop();
};

Server.prototype._handleRequest = function(body) {
	console.log(encoders[this.options.encoder].decode(body));
};

/* Exports -------------------------------------------------------------------*/

module.exports = Server;
/**
 * Server class
 * @class Server
 * @exports {Server}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var debug = require('debug')('kalm');

var Client = require('./Client');
var adapters = require('./adapters');
var encoders = require('./encoders');

/* Methods -------------------------------------------------------------------*/

/**
 * Server constructor
 * @constructor
 * @param {object} options The configuration options for the server
 */
function Server(options) {
	EventEmitter.call(this);

	options = options || {};

	this.status = 'off';
	this.options = {
		adapter: options.adapter || 'ipc',
		encoder: options.encoder || 'json',
		port: options.port || 80
	};

	this.listen();
}

/**
 * Server lift
 * @method
 * @memberof Server
 */
Server.prototype.listen = function(callback) {
	var adapter = adapters.resolve(this.options.adapter);
	if (adapter) {
		debug('log: listening ' + this.options.adapter + '://0.0.0.0:' + this.options.port);
		adapter.listen(this, this._handleLift.bind(this));
	}
	else {
		debug('error: no adapter found "' + this.options.adapter + '"');
	}
};

Server.prototype._handleLift = function() {
	this.emit('ready');
};

Server.prototype.stop = function() {
	if (this.listener) this.listener.stop();
};

Server.prototype._handleRequest = function(socket) {
	console.log(socket);
	this.emit('connection', new Client(socket));
};

util.inherits(Server, EventEmitter);

/* Exports -------------------------------------------------------------------*/

module.exports = Server;
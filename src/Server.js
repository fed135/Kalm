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

	this.options = {
		adapter: options.adapter || 'ipc',
		encoder: options.encoder || 'json',
		port: options.port || 80
	};

	this.connections = [];
	this.channels = options.channels || {};

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

Server.prototype.broadcast = function(channel, payload) {
	for (var i = this.connections.length - 1; i >= 0; i--) {
		this.connections[i].send(channel, payload);
	}
};

Server.prototype._handleLift = function() {
	this.emit('ready');
};

Server.prototype.stop = function() {
	this.connections.length = 0;
	if (this.listener) this.listener.stop();
};

Server.prototype._handleRequest = function(socket) {
	var client = new Client(socket, {
		adapter: this.options.adapter,
		encoder: this.options.encoder,
		channels: this.channels
	});
	socket.on('data', client._handleRequest.bind(client));
	this.connections.push(client);
	this.emit('connection', client);
};

util.inherits(Server, EventEmitter);

/* Exports -------------------------------------------------------------------*/

module.exports = Server;
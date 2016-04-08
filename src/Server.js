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
		port: options.port || 3000
	};

	this.connections = [];
	this.channels = options.channels || {};

	this.listen();
}

/**
 * Server lift method
 * @method listen
 * @memberof Server
 * @param {function} callback The callback method for server lift
 */
Server.prototype.listen = function(callback) {
	var adapter = adapters.resolve(this.options.adapter);
	var _self = this;

	if (adapter) {
		debug('log: listening ' + this.options.adapter + '://0.0.0.0:' + this.options.port);
		adapter.listen(this, function _handleLift() {
			process.nextTick(function _deferredLift() {
				_self.emit('ready');
			});
		});
	}
	else {
		debug('error: no adapter found "' + this.options.adapter + '"');
	}
};

/**
 * Adds a channel to listen for on attached clients
 * @method channel
 * @memberof Server
 * @param {string} name The name of the channel to attach
 * @param {function} handler The handler to attach to the channel
 * @returns {Server} Returns itself for chaining
 */
Server.prototype.channel = function(name, handler) {
	this.channels[name] = handler;

	return this;
};

/**
 * Sends data to all connected clients
 * @method broadcast
 * @memberof Server
 * @param {string} channel The name of the channel to send to
 * @param {string|object} payload The payload to send
 * @returns {Server} Returns itself for chaining
 */
Server.prototype.broadcast = function(channel, payload) {
	for (var i = this.connections.length - 1; i >= 0; i--) {
		this.connections[i].send(channel, payload);
	}

	return this;
};

/**
 * Closes the server
 * @method stop
 * @memberof Server
 * @param {function} callback The callback method for the operation
 */
Server.prototype.stop = function(callback) {
	debug('warn: stopping server');
	if (this.listener) {
		adapters.resolve(this.options.adapter).stop(this, callback);
	}
	else {
		callback();
	}
};

/**
 * Handler for receiving a new connection
 * @private
 * @method _handleRequest
 * @memberof Server
 * @param {Socket} socket The received connection socket
 */
Server.prototype._handleRequest = function(socket) {
	var client = new Client(socket, {
		adapter: this.options.adapter,
		encoder: this.options.encoder,
		channels: this.channels
	});
	this.connections.push(client);
	this.emit('connection', client);
	return client;
};

util.inherits(Server, EventEmitter);

/* Exports -------------------------------------------------------------------*/

module.exports = Server;
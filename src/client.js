/**
 * Client class
 * @class Client
 * @exports {Client}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var debug = require('debug')('kalm');

var adapters = require('./adapters');
var Channel = require('./channel');
var encoders = require('./encoders');

/* Methods -------------------------------------------------------------------*/

/**
 * Client constructor
 * @constructor
 * @param {object} options The configuration options for the client
 */
function Client(options) {
	options = options || {};

	this.options = {
		hostname: options.hostname || '0.0.0.0',
		adapter: options.adapter || 'ipc',
		encoder: options.encoder || 'json',
		port: options.port || 80,
		maxBundle: options.maxBundle || 100,	// Maybe put an hard limit ?
		bundleDelay: options.bundleDelay || (1000/128)
	};

	this.channels = {};
}

/**
 * Recovers or create a channel for the client
 * @method channel
 * @memberof Client
 * @param {string|null} name The name of the channel.
 * @returns {Channel} The recovered or created channel
 */
Client.prototype.channel = function(name) {
	var s;

	name = name || '/';

	if (name in this.channels) return this.channels[name];

	debug('log: New Channel ' + name);

	s = new Channel(name, this);
	this.channels[name] = s;
	s.connect(adapters[this.options.adapter]);
	s.onDisconnect.add(this.removeChannel.bind(this));

	return s;
};

/**
 * Calls the disconnect method for the channel
 * @method removechannel
 * @memberof Client
 * @param {Channel} channel The channel to disconnect, then remove from the list
 */
Client.prototype.removeChannel = function(channel) {
	// TODO: Auto-reconnect (will hook onto another cluster or server)
	debug('warn: Connection for channel ' + 
		channel.label +
		' lost.'
	);

	delete this.channels[channel.channel];
};

Client.prototype._handleRequest = function(body) {
	console.log(encoders[this.options.encoder].decode(body));
};

/* Exports -------------------------------------------------------------------*/

module.exports = Client;
/**
 * Peer class
 * @class Peer
 * @exports {Peer}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Channel = require('./channel');

/* Methods -------------------------------------------------------------------*/

/**
 * Peer constructor
 * @constructor
 * @param {object} options The configuration options for the peer
 */
function Peer(k, options) {
	var _self = this;

	this.label = options.label;
	this.circles = options.circles;
	this.options = {
		hostname: options.hostname || '0.0.0.0',
		adapter: options.adapter || 'ipc',
		port: options.port || 80
	};
	this.p = k;

	this.channels = {};
	this.handlers = {};
}

/**
 * Recovers or create a channel for the peer
 * @method channel
 * @memberof Peer
 * @param {string|null} name The name of the channel.
 * @param {object|null} options The options for the channel
 * @returns {Channel} The recovered or created channel
 */
Peer.prototype.channel = function(name, options) {
	var net = this.p.components.net;
	var console = this.p.components.console;
	var s;

	name = name || '/';
	options = options || { channel: name };

	if (name in this.channels) return this.channels[name];

	console.log('New Channel ' + name + ' for peer ' + this.label);

	options.peer = this;
	s = new Channel(options);
	this.channels[name] = s;
	s.connect(net.adapters[this.options.adapter]);
	s.onDisconnect.add(this.removeChannel.bind(this));

	return s;
};

/**
 * Calls the disconnect method for the channel
 * @method removechannel
 * @memberof Peer
 * @param {Channel} channel The channel to disconnect, then remove from the list
 */
Peer.prototype.removeChannel = function(channel) {
	// TODO: Auto-reconnect (will hook onto another cluster or server)
	var console = this.p.components.console;
	console.warn('Connection with peer ' + 
		this.label + 
		', for channel ' + 
		channel.label +
		' lost.'
	);

	delete this.channels[channel.channel];
};

/* Exports -------------------------------------------------------------------*/

module.exports = Peer;
/**
 * Socket class
 * @class Socket
 * @exports {Socket}
 */

'use strict'

/* Requires ------------------------------------------------------------------*/

var Signal = require('signals');

/* Methods -------------------------------------------------------------------*/

/**
 * Socket constructor
 * @constructor
 * @param {object} options The configuration options for the socket
 */
function Socket(options) {
	var connection = K.getComponent('connection');

	this.label = options.label;
	this.service = options.service;

	this.client = connection.createClient(options.service);
	this.status = 'connected';

	this.client.onconnect.add((function() {
		this.status = 'connected';
		this._renderQueue();
	}).bind(this));

	this._outbox = [];
}

/**
 * Renders the queue, once connected or reconnected
 * @private
 * @method _renderQueue
 * @memberof Socket
 */
Socket.prototype._renderQueue = function() {
	this._outbox.filter(function(e) {
		this.send.apply(this, e);
		return false;
	}, this);
};

/**
 * Sends a request with the socket
 * @method send
 * @memberof Socket
 * @param {*} payload The payload to send
 * @param {function} callback The callback method
 */
Socket.prototype.send = function(payload, callback) {
	var connection = K.getComponent('connection');

	if (this.status !== 'connected') {
		this._outbox.push([payload, callback]);
		return this;
	}

	connection.send(this.service, payload, this, callback);

	return this;
};

/**
 * Destroys the socket instance - async
 * @method destroy
 * @memberof Socket
 */
Socket.prototype.destroy = function() {
	//TODO: make sure that all clients implement disconnect
	this.client.disconnect();
};

/* Exports -------------------------------------------------------------------*/

module.exports = Socket;
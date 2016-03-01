/**
 * WebSocket connector methods
 * @adapter ws
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var io = require('socket.io');
var http = require('http');

/* Methods -------------------------------------------------------------------*/

/**
 * WebSocket adapter
 * @constructor
 * @param {Kalm} K The Kalm instance
 */
function WS(options, handler) {
	this.options = options;
	this.handler = handler;
	this.server = null;
}

/**
 * Listens for websocket connections on the selected port.
 * @method listen
 * @memberof WS
 * @param {object} options The config object for that adapter
 * @param {function} handler The central handling method for requests
 * @param {function} callback The success callback for the operation
 */
WS.prototype.listen = function(callback) {
	var _self = this;
	var hs = http.createServer();
	this.server = io(hs);

	this.server.on('connection', function(socket) {
  	socket.on('event', _self.handler);
  });

	hs.listen(this.options.port, callback);
};

/**
 * Sends a message with a socket client, then pushes it back to its peer
 * @method send
 * @memberof WS
 * @param {Service} peer The peer to send to
 * @param {Buffer} payload The body of the request
 * @param {Socket} socket The socket to use
 * @param {function|null} callback The callback method
 */
WS.prototype.send = function(payload, socket, callback) {
	socket.client.emit(payload, callback || function() {});
};

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @memberof WS
 * @param {object} options The config object for that adapter
 * @param {Service} peer The peer to create the socket for
 * @returns {Client} The created ws client
 */
WS.prototype.createClient = function(peer, handler) {
	var socket = io.connect(this.peer.port);
	socket.on('data', handler);

	return socket;
};

/**
 * Calls the disconnect method on a socket
 * @method removeClient
 * @memberof WS
 * @param {Socket} socket The socket to disconnect
 */
 WS.prototype.removeClient = function() {
	this.client.disconnect();
};

/**
 * Stops listening for web scoket connections and closes the server
 * @method stop
 * @memberof WS
 * @param {function|null} callback The callback method
 */ 
WS.prototype.stop = function(callback) {
	if (this.server) this.server.close(callback);
	else callback();
};

/* Exports -------------------------------------------------------------------*/

module.exports = WS;
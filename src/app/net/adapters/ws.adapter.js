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
function WS(K) {
	this.type = 'ws';
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
WS.prototype.listen = function(options, handler, callback) {
	var _self = this;
	this.server = http.createServer(function(req) {
		handler(req, _self);
	});

	io.listen(this.server);
	this.server.listen(options.path + options.port, callback);
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
WS.prototype.send = function(peer, payload, socket, callback) {
	socket.client.emit(payload, function() {
		if (!peer._pushSocket(socket)) {
			socket.client.disconnect();
		}

		if (callback) callback();
	});
};

/**
 * Creates a client and adds the listeners to it
 * @method createClient
 * @memberof WS
 * @param {object} options The config object for that adapter
 * @param {Service} peer The peer to create the socket for
 * @returns {Client} The created ws client
 */
WS.prototype.createClient = function(options, peer) {
	var socket = io.connect(options.url + ':' + peer.port);

	socket.ondisconnect.add(function() {
		peer._removeSocket(socket);
	});

	socket.onerror.add(function() {
		peer._removeSocket(socket);
	});

	return socket;
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
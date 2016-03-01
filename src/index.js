/**
 * Kalm bootstraper
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Client = require('./client');
var Server = require('./server');

/* Methods -------------------------------------------------------------------*/

function listen(options) {
	return new Promise(function(resolve) {
		var server = new Server(options);
		server.listen(function() {
			resolve(server);
		});
	});
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	Client: Client,
	Server: Server,
	listen: listen
};
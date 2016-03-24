/**
 * Kalm bootstraper
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Client = require('./Client');
var Server = require('./Server');

/* Exports -------------------------------------------------------------------*/

module.exports = {
	Client: Client,
	Server: Server
};
/**
 * Kalm bootstraper
 * @exports {object}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Client = require('./Client');
var Server = require('./Server');
var adapters = require('./adapters');
var encoders = require('./encoders');
var middleware = require('./middleware');
var defaults = require('./defaults');

/* Exports -------------------------------------------------------------------*/

module.exports = {
	Client: Client,
	Server: Server,
	adapters: adapters,
	encoders: encoders,
	middleware: middleware,
	defaults: defaults
};
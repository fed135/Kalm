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
var defaults = require('./defaults');

/* Exports -------------------------------------------------------------------*/

module.exports = {
	Client: Client,
	Server: Server,
	adapters: adapters,
	encoders: encoders,
	defaults: defaults
};
/**
 * Kalm bootstraper
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Client = require('./Client');
var Server = require('./Server');
var adapters = require('./adapters');
var encoders = require('./encoders');
var defaults = require('./defaults');
var Adapter = require('./adapters/common');
var Encoder = require('./encoders/common');

/* Exports -------------------------------------------------------------------*/

module.exports = {
	Client: Client,
	Server: Server,
	adapters: adapters,
	encoders: encoders,
	defaults: defaults,
	Adapter: Adapter,
	Encoder: Encoder
};
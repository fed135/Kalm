/**
 * Kalm bootstraper
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

// If running in the browser, do not load server module
const is_browser = (require('os').platform() === 'browser');

const Server = (is_browser)?null:require('./Server');
const Client = require('./Client');
const adapters = require('./adapters');
const encoders = require('./encoders');
const defaults = require('./defaults');
const Adapter = require('./adapters/common');

/* Exports -------------------------------------------------------------------*/

module.exports = {
	Client,
	Server,
	adapters,
	encoders,
	defaults,
	Adapter
};
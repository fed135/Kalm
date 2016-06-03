/**
 * Client class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../src/Client');

/* Tests ---------------------------------------------------------------------*/

/*constructor(options={}, socket=null) {
		super();

		this.id = crypto.randomBytes(20).toString('hex');

		this.options = {
			// Basic info
			hostname: options.hostname || defaults.hostname,
			port: options.port || defaults.port,
			// Adapter
			adapter: options.adapter || defaults.adapter,
			// Encoding
			encoder: options.encoder || defaults.encoder,
			// Transformations (middleware)
			bundler: options.bundler || defaults.bundler,
			// Wether to output statistics in stdout
			stats: options.stats || defaults.stats,
			// Socket timeout
			socketTimeout: options.socketTimeout || defaults.socketTimeout
		};

		// List of channels 
		this.channels = {};
		
		// Server tick reference
		this.tick = options.tick || null;

		// Populate channels
		if (options.channels) {
			for (var c in options.channels) {
				this.subscribe(c, options.channels[c]);
			}
		}

		// Socket object
		this.socket = null;
		this.use(socket);
	}

subscribe(name, handler, options={}) {}

unsubscribe(name, handler) {}

use(socket) {}

handleError(err) {}

handleConnect(socket) {}

handleDisconnect(socket) {}

send(name, payload) {}

sendOnce(name, payload) {}

sendNow(name, payload) {}

createSocket(socket) {}

handleRequest(evt) {}

destroy() {}
*/
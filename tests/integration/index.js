/**
 * Kalm integration test suite
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var sinon = require('sinon');
var expect = require('chai').expect;
var Kalm = require('../../index');

/* Suite --------------------------------------------------------------------*/

describe('Integration tests', () => {

	['ipc', 'tcp', 'udp'].forEach((adapter) => {
		describe('Testing ' + adapter + ' adapter', () => {
			var server;

			/* --- Setup ---*/

			// Create a server before each scenario
			beforeEach((done) => {
				server = new Kalm.Server({adapter: adapter});
				server.on('ready', done);
			});

			// Cleanup afterwards
			afterEach((done) => {
				server.stop(() => {
					server = null;
					done();
				})
			});

			/* --- Tests --- */

			it('should work with ' + adapter, (done) => {
				server.subscribe('test', (data) => {
					expect(data).to.eql({foo:'bar'});
					done();
				});

				var client = new Kalm.Client({adapter:adapter});
				client.send('test', {foo:'bar'});
			});

			it('should handle reconnection with ' + adapter, (done) => {
				done();
			});

			it('should handle large payloads with ' + adapter, (done) => {
				done();
			});
		});
	});
});
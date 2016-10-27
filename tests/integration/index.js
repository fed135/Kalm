/**
 * Kalm integration test suite
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const expect = require('chai').expect;
const Kalm = require('../../index');

/* Suite --------------------------------------------------------------------*/

describe('Integration tests', () => {

	['ipc', 'tcp', 'udp'].forEach((adapter) => {
		describe('Testing ' + adapter + ' adapter', () => {
			let server;

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
				let payload = {foo:'bar'};
				server.subscribe('test', (data) => {
					expect(data).to.eql(payload);
					done();
				});

				let client = new Kalm.Client({adapter:adapter});
				client.send('test', payload);
			});

			it('should handle large payloads with ' + adapter, (done) => {
				let largePayload = [];
				while(largePayload.length < 2048) {
					largePayload.push({foo: 'bar'});
				}

				server.subscribe('test', (data) => {
					expect(data).to.eql(largePayload);
					done();
				});

				let client = new Kalm.Client({adapter:adapter});
				client.send('test', largePayload);
			});
		});
	});
});
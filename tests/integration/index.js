/**
 * Kalm integration test suite
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const expect = require('chai').expect;
const Kalm = require('../../index');

/* Suite --------------------------------------------------------------------*/

describe('Integration tests', () => {

	['IPC', 'TCP', 'UDP'].forEach((transport) => {
		describe('Testing ' + transport + ' transport', () => {
			let server;

			/* --- Setup ---*/

			// Create a server before each scenario
			beforeEach(() => {
				server = Kalm.listen({ transport: Kalm.transports[transport] });
			});

			// Cleanup afterwards
			afterEach((done) => {
				server.stop(() => {
					server = null;
					done();
				})
			});

			/* --- Tests --- */

			it('should work with ' + transport, (done) => {
				let payload = {foo:'bar'};
				server.subscribe('test', (data) => {
					expect(data).to.eql(payload);
					done();
				});

				let client = Kalm.connect({ transport: Kalm.transports[transport] });
				client.write('test', payload);
			});

			it('should handle large payloads with ' + transport, (done) => {
				let largePayload = [];
				while(largePayload.length < 2048) {
					largePayload.push({foo: 'bar'});
				}

				server.subscribe('test', (data) => {
					expect(data).to.eql(largePayload);
					done();
				});

				let client = Kalm.connect({ transport: Kalm.transports[transport] });
				client.write('test', largePayload);
			});
		});
	});
});
/**
 * Server class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const expect = require('chai').expect;
const sinon = require('sinon');
const testModule = require('../../src/serverFactory');
const clientFactory = require('../../src/clientFactory');

const EventEmitter = require('events').EventEmitter;

/* Tests ---------------------------------------------------------------------*/

describe('Server', () => {

	var testServer;

	afterEach((done) => {
		if (testServer.stop) {
			testServer.stop();
		}
		sinon.mock.restore();
		done();
	});

	describe('#constructor(options)', () => {
		it('should create a valid Server', () => {
			testServer = testModule.create();
			expect(testServer.id).to.be.string;
			expect(testServer.connections).to.be.array;
			expect(testServer.channels).to.be.object;
		});
	});

	describe('#subscribe(name, handler, options)', () => {
		it('new and existing connections subscribe to the channel and add the handler', () => {
			const testHandler = function () {};
			testServer = testModule.create();
			const testSubscribe = sinon.spy();
			testServer.connections.push({
				subscribe: testSubscribe
			});

			testServer.subscribe('test', testHandler);
			expect(testServer.channels.test).to.deep.equal([['test', testHandler, undefined]]);
			expect(testSubscribe.calledOnce).to.be.true;
		});
	});

	describe('#unsubscribe(name, handler)', () => {
		it('new and existing connections remove the handler from their channel', () => {
			const testHandler = function () {};
			testServer = testModule.create();
			const testUnsubscribe = sinon.spy();
			testServer.connections.push({
				unsubscribe: testUnsubscribe
			});
			testServer.unsubscribe('test', testHandler);
			expect(testServer.channels.test).to.be.array;
			expect(testUnsubscribe.calledOnce).to.be.true;
		});
	});

	describe('#broadcast(channel, payload)', () => {
		it('should call send on all connections', () => {
			testServer = testModule.create();
			const testSocket = { 
				on: function() {},
				setTimeout: function() {},
				end: function() {},
				destroy: function() {},
				pipe: function() {
					return new EventEmitter();
				}
			};
			testServer.connections.push(clientFactory.create({ socket: testSocket }));
			testServer.broadcast('test', 'test');
			expect(testServer.connections[0].channels.test.packets).to.include('test');
		});
	});

	describe('#stop(callback)', () => {
		it('should call the appropriate adapter\'s stop', (done) => {
			testServer = testModule.create();
			const adapterTest = sinon.mock(adapters.resolve(testServer.options.adapter));
			testServer.stop(() => {
				testServer.listener = { 
					close: function(cb) {
						cb(); 
					} 
				};

				testServer.stop(() => {
					expect(testServer.listener).to.be.null;
					sinon.mock.restore();
					done();
				});
			});
		});
	});

	describe('#handleError(err)', () => {
		it('should print and dispatch the error', (done) => {
			testServer = testModule.create();
			testServer.on('error', (e) => done());
			testServer.handleError('testError');
		});
	});

	describe('#handleRequest(socket)', () => {
		it('should push the new connection and dispatch connection events', (done) => {
			const testSocket = { 
				on: function() {},
				setTimeout: function() {},
				end: function() {},
				destroy: function() {},
				pipe: function() {
					return new EventEmitter();
				}
			};

			testServer = testModule.create();
			testServer.on('connect', () => {
				expect(testServer.connections.length).to.be.equal(1);
				expect(testServer.connections[0].options).to.deep.equal({
					adapter: 'tcp',
					encoder: 'json',
					hostname: '0.0.0.0',
					port: 3000,
					bundler: {
						delay: 16,
						maxPackets: 2048,
						serverTick: false,
						splitBatches: true
					},
					socketTimeout: 30000,
					stats: false,
					rejectForeign: true
				});
				done();
			});
			testServer.handleRequest(testSocket);
		});
	});
});

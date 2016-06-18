/**
 * Server class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../src/Server');
var defaults = require('../../src/defaults');
var adapters = require('../../src/adapters');
var Client = require('../../src/Client');

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
			testServer = new testModule();
			expect(testServer.id).to.be.string;
			expect(testServer.options).to.deep.equal({
				adapter: defaults.adapter,
				encoder: defaults.encoder,
				port: defaults.port,
				tick: defaults.tick,
				socketTimeout: defaults.socketTimeout
			});
			expect(testServer.connections).to.be.array;
			expect(testServer.channels).to.be.object;
		});
	});

	describe('#setTick(delay)', () => {
		it('should setup the server heartbeat', (done) => {
			testServer = new testModule();
			testServer.setTick(16);
			expect(testServer._timer).to.not.be.null;
			expect(testServer._timer.delay).to.equal(16);

			testServer._timer.on('step', done);
		});
	});

	describe('#subscribe(name, handler, options)', () => {
		it('new and existing connections subscribe to the channel and add the handler', () => {
			var testHandler = function () {};
			testServer = new testModule();
			var testSubscribe = sinon.spy();
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
			var testHandler = function () {};
			testServer = new testModule({
				channels: {
					test: testHandler
				}
			});
			var testUnsubscribe = sinon.spy();
			testServer.connections.push({
				unsubscribe: testUnsubscribe
			});
			testServer.unsubscribe('test', testHandler);
			expect(testServer.channels.test).to.be.array;
			expect(testUnsubscribe.calledOnce).to.be.true;
		});
	});

	describe('#dump()', () => {
		it('should dump a map of all the open sockets and pending payloads', () => {
			testServer = new testModule();
			var testSocket = { 
				on: function() {},
				setTimeout: function() {},
				end: function() {},
				destroy: function() {},
				pipe: function() {}
			};
			testServer.connections.push(new Client({
				bundler: {
					delay: 3000
				}
			}, testSocket));
			testServer.broadcast('test', 'test');
			var result = testServer.dump();
			expect(result).to.deep.equal([
				{
					adapter: 'tcp',
      		bundler: {
      			delay: 3000,
      			maxPackets: 2048,
      			serverTick: false,
      			splitBatches: true
      		},
					channels: {
						test: ['test'] 
					},
					encoder: 'json',
					hostname: '0.0.0.0',
					port: 3000,
					socketTimeout: 30000,
					stats: false
				}
			]);
		});
	});

	describe('#broadcast(channel, payload)', () => {
		it('should call send on all connections', () => {
			testServer = new testModule();
			var testSocket = { 
				on: function() {},
				setTimeout: function() {},
				end: function() {},
				destroy: function() {},
				pipe: function() {}
			};
			testServer.connections.push(new Client({
				bundler: {
					delay: 3000
				}
			}, testSocket));
			testServer.broadcast('test', 'test');
			expect(testServer.connections[0].channels.test.packets).to.include('test');
		});
	});

	describe('#whisper(channel, payload)', () => {
		it('should call send on all connections that have the specified channel', () => {
			testServer = new testModule();
			var testSocket = { 
				on: function() {},
				setTimeout: function() {},
				end: function() {},
				destroy: function() {},
				pipe: function() {}
			};
			testServer.connections.push(new Client({
				bundler: {
					delay: 3000
				}
			}, testSocket));
			testServer.whisper('test', 'test');
			expect(testServer.connections[0].channels.test).to.be.undefined;
		});
	});

	describe('#stop(callback)', () => {
		it('should call the appropriate adapter\'s stop', (done) => {
			testServer = new testModule();
			var adapterTest = sinon.mock(adapters.resolve(testServer.options.adapter));
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
			testServer = new testModule();
			testServer.on('error', (e) => { 
				done();
			});
			testServer.handleError('testError');
		});
	});

	describe('#handleRequest(socket)', () => {
		it('should push the new connection and dispatch connection events', (done) => {
			var testSocket = { 
				on: function() {},
				setTimeout: function() {},
				end: function() {},
				destroy: function() {},
				pipe: function() {}
			};

			testServer = new testModule();
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
					stats: false
				});
				done();
			});
			testServer.handleRequest(testSocket);
		});
	});
});

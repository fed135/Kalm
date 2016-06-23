/**
 * Client class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../src/Client');
var Channel = require('../../src/Channel');
var defaults = require('../../src/defaults');
var adapters = require('../../src/adapters');

const EventEmitter = require('events').EventEmitter;

/* Tests ---------------------------------------------------------------------*/

describe('Client', () => {

	var testSocket = { 
		on: function() {},
		setTimeout: function() {},
		end: function() {},
		write: function() {},
		once: function() {},
		destroy: function() {},
		pipe: function() {
			return new EventEmitter();
		}
	};

	describe('#constructor(options, socket)', () => {
		it('should create a valid Client', () => {
			var result = new testModule();
			expect(result.id).to.be.string;
			expect(result.options).to.deep.equal({
				hostname: defaults.hostname,
				port: defaults.port,
				adapter: defaults.adapter,
				encoder: defaults.encoder,
				bundler: defaults.bundler,
				stats: defaults.stats,
				socketTimeout: defaults.socketTimeout,
				rejectForeign: defaults.rejectForeign
			});
			expect(result.channels).to.not.be.object;
			expect(result.fromServer).to.be.false;
			expect(result.tick).to.be.null;
			expect(result.socket).to.not.be.null;
		});
	});

	describe('#subscribe(name, handler, options)', () => {
		it('should use/create a channel and add the handler to it', () => {
			var testClient = new testModule();
			var testHandler = function foo() {};
			testClient.subscribe('test', testHandler);

			expect(testClient.channels.test).to.be.instanceof(Channel);
			expect(testClient.channels.test.handlers).to.include(testHandler);
		});
	});

	describe('#unsubscribe(name, handler)', () => {
		it('should remove a handler from a channel', () => {
			var testClient = new testModule();
			var testHandler = function foo() {};
			testClient.subscribe('test', testHandler);
			testClient.unsubscribe('test', testHandler);

			expect(testClient.channels.test).to.be.instanceof(Channel);
			expect(testClient.channels.test.handlers).to.not.include(testHandler);
		});
	});

	describe('#use(socket)', () => {
		it('should replace the client\'s socket object', () => {
			var testClient = new testModule();
			testClient.use(testSocket);
			expect(testClient.socket).to.equal(testSocket);
		});
	});

	describe('#handleError(err)', () => {
		it('should print and dispatch the error', (done) => {
			var testClient = new testModule({}, testSocket);
			testClient.on('error', () => done());
			testClient.handleError(new Error);
		});
	});

	describe('#handleConnect(socket)', () => {
		it('should print and dispatch the event', (done) => {
			var testClient = new testModule({}, testSocket);
			testClient.on('connect', () => done());
			testClient.handleConnect({});
		});

		it('should print and dispatch the alternate event', (done) => {
			var testClient = new testModule({}, testSocket);
			testClient.on('connection', () => done());
			testClient.handleConnect({});
		});
	});

	describe('#handleDisconnect(socket)', () => {
		it('should print and dispatch the event', (done) => {
			var testClient = new testModule({}, testSocket);
			testClient.on('disconnect', () => done());
			testClient.handleDisconnect({});
		});

		it('should print and dispatch the alternate event', (done) => {
			var testClient = new testModule({}, testSocket);
			testClient.on('disconnection', () => done());
			testClient.handleDisconnect({});
		});
	});

	describe('#send(name, payload)', () => {
		it('should call send on the proper channel', () => {
			var testClient = new testModule({}, testSocket);
			var testPayloads = [
				{foo: 'bar'},
				{foo: 'baz'}
			];

			testPayloads.forEach((payload) => {
				testClient.send('test-channel', payload);
			});
			expect(testClient.channels['test-channel']).to.not.be.null;
			expect(testClient.channels['test-channel'].packets).to.deep.equal(testPayloads);
		});
	});

	describe('#sendOnce(name, payload)', () => {
		it('should call sendOnce on the proper channel', () => {
			var testClient = new testModule({}, testSocket);
			var testPayloads = [
				{foo: 'bar'},
				{foo: 'baz'}
			];

			testPayloads.forEach((payload) => {
				testClient.sendOnce('test-channel', payload);
			});
			expect(testClient.channels['test-channel']).to.not.be.null;
			expect(testClient.channels['test-channel'].packets).to.deep.equal([testPayloads[1]]);
		});
	});

	describe('#sendNow(name, payload)', () => {
		it('should call _emit directly', () => {
			var testClient = new testModule({}, testSocket);
			var testPayloads = [
				{foo: 'bar'},
				{foo: 'baz'}
			];

			testPayloads.forEach((payload) => {
				testClient.sendNow('test-channel', payload);
			});
			expect(testClient.channels['test-channel']).to.not.be.null;
			expect(testClient.channels['test-channel'].packets.length).to.equal(0);
		});
	});

	describe('#createSocket(socket)', () => {
		it('should call the appropriate adapter\'s createSocket', () => {
			var testClient = new testModule({});
			var result = testClient.createSocket();
			expect(result.on).is.function;
			expect(result.emit).is.function;
			expect(result.write).is.function;
			expect(result.end).is.function;
			expect(result.connect).is.function;
			expect(result.setTimeout).is.function;
			expect(result.destroy).is.function;
		});
	});

	describe('#handleRequest(evt)', () => {
		it('should call handleData on the appropriate channels', (done) => {
			var testClient = new testModule({}, testSocket);
			var testHandler1 = sinon.spy();
			var testHandler2 = sinon.spy();
			testClient.subscribe('test', testHandler1);
			testClient.subscribe('test2', testHandler2);

			testClient.handleRequest(JSON.stringify(['test', ['data']]));

			setTimeout(() => {
				expect(testHandler1.withArgs('data').calledOnce).to.be.true;
				expect(testHandler2.calledOnce).to.be.false;
				done();
			},1);
		});
	});

	describe('#destroy()', () => {
		it('should call the appropriate adapter\'s disconnect', (done) => {
			var testClient = new testModule({}, testSocket);

			testClient.on('disconnect', () => {
				expect(testClient.socket).to.be.null;
				done();
			});
			
			testClient.destroy();
		});
	});
});

/**
 * Client class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const expect = require('chai').expect;
const sinon = require('sinon');
const testModule = require('../../src/clientFactory');

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
			const result = testModule.create();
			expect(result.id).to.be.string;
			expect(result.channels).to.not.be.object;
			expect(result.fromServer).to.be.false;
			expect(result.tick).to.be.null;
			expect(result.socket).to.not.be.null;
		});
	});

	describe('#subscribe(name, handler, options)', () => {
		it('should use/create a channel and add the handler to it', () => {
			const testClient = testModule.create();
			const testHandler = function foo() {};
			testClient.subscribe('test', testHandler);

			expect(testClient.channels.test).to.be.instanceof(Channel);
			expect(testClient.channels.test.handlers).to.include(testHandler);
		});
	});

	describe('#unsubscribe(name, handler)', () => {
		it('should remove a handler from a channel', () => {
			const testClient = testModule.create();
			const testHandler = function foo() {};
			testClient.subscribe('test', testHandler);
			testClient.unsubscribe('test', testHandler);

			expect(testClient.channels.test).to.be.instanceof(Channel);
			expect(testClient.channels.test.handlers).to.not.include(testHandler);
		});
	});

	describe('#handleError(err)', () => {
		it('should print and dispatch the error', (done) => {
			const testClient = testModule.create({ socket: testSocket });
			testClient.on('error', () => done());
			testClient.handleError(new Error);
		});
	});

	describe('#handleConnect(socket)', () => {
		it('should print and dispatch the event', (done) => {
			const testClient = testModule.create({ socket: testSocket });
			testClient.on('connect', () => done());
			testClient.handleConnect({});
		});

		it('should print and dispatch the alternate event', (done) => {
			const testClient = testModule.create({ socket: testSocket });
			testClient.on('connection', () => done());
			testClient.handleConnect({});
		});
	});

	describe('#handleDisconnect(socket)', () => {
		it('should print and dispatch the event', (done) => {
			const testClient = testModule.create({ socket: testSocket });
			testClient.on('disconnect', () => done());
			testClient.handleDisconnect({});
		});

		it('should print and dispatch the alternate event', (done) => {
			const testClient = testModule.create({ socket: testSocket });
			testClient.on('disconnection', () => done());
			testClient.handleDisconnect({});
		});
	});

	describe('#send(name, payload)', () => {
		it('should call send on the proper channel', () => {
			const testClient = testModule.create({ socket: testSocket });
			const testPayloads = [
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

	describe('#createSocket(socket)', () => {
		it('should call the appropriate adapter\'s createSocket', () => {
			const testClient = testModule.create({});
			const result = testClient.createSocket();
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
			const testClient = testModule.create({ socket: testSocket });
			const testHandler1 = sinon.spy();
			const testHandler2 = sinon.spy();
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
			const testClient = testModule.create({ socket: testSocket });

			testClient.on('disconnect', () => {
				expect(testClient.socket).to.be.null;
				done();
			});
			
			testClient.destroy();
		});
	});
});

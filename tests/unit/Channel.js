/**
 * Channel class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../src/Channel');

/* Tests ---------------------------------------------------------------------*/

describe('Channel', () => {
	var mockClient = { _emit: function(){} };

	describe('#constructor(name, options, client)', () => {
		it('should create a valid Channel with own timer', () => {

			var testClient = { 
				options: { 
					foo: 'bar'
				},
				_emit: function(){}
			};

			var result = new testModule('test-owntimer', {
				splitBatches: true,
				serverTick: false
			}, testClient);

			expect(result.id).to.be.string;
			expect(result.name).to.be.equal('test-owntimer');
			expect(result.options).to.deep.equal({
				splitBatches: true,
				serverTick: false
			});
			expect(result._client).to.equal(testClient);
			expect(result._timer).to.be.null;
			expect(result.packets).to.be.array;
			expect(result.handlers).to.be.array;
			expect(result.splitBatches).to.be.true;
		});

		it('should create a valid Channel with server timer', () => {

			var mockTimer = sinon.mock({
				on: function() {}
			});

			var mockClient = {
				options: {
					tick: mockTimer.object
				},
				_emit: function(){}
			};

			mockTimer.expects('on')
				.once()
				.withArgs('step');

			var result = new testModule('test-servertimer', {
				splitBatches: true,
				serverTick: true
			}, mockClient);

			mockTimer.verify();
			sinon.mock.restore();
		});
	});

	describe('#send(payload)', () => {
		it('should append the packet and start the bundler', () => {
			var packet = {foo: 'bar'};
			var testChannel = new testModule('test', {}, mockClient);
			var bundlerStub = sinon.stub(testChannel, 'startBundler');

			testChannel.send(packet);
			testChannel.send('test');
			expect(testChannel.packets).to.include(packet);
			bundlerStub.restore();
		});
	});

	describe('#sendOnce(payload)', () => {
		it('should replace all packet with the payload', () => {
			var packet = {foo: 'bar'};
			var testChannel = new testModule('test', {}, mockClient);
			var bundlerStub = sinon.stub(testChannel, 'startBundler');

			testChannel.sendOnce(packet);
			testChannel.sendOnce(packet);
			expect(testChannel.packets).to.deep.equal([packet]);
			bundlerStub.restore();
		});
	});	

	describe('#startBundler()', () => {
		it('should call _emit in a timeout', () => {
			var testChannel = new testModule('test', {}, mockClient);
			var emitStub = sinon.stub(testChannel, '_emit');
			testChannel.startBundler();
			testChannel.resetBundler();
			emitStub.restore();
		});
	});

	describe('#resetBundler()', () => {
		it('should reset the bundler', () => {
			var testChannel = new testModule('test', {}, mockClient);
			var emitStub = sinon.stub(testChannel, '_emit');
			emitStub.onFirstCall()
				.throws('_emit should not have been called');

			testChannel.startBundler();
			testChannel.resetBundler();
			emitStub.restore();
		});
	});

	describe('#addHandler(method, bindOnce)', () => {
		it('should adds a method to the handlers list', () => {
			var testChannel = new testModule('test', {}, mockClient);
			var method = function testHandler() {};
			testChannel.addHandler(method);
			expect(testChannel.handlers).to.include(method);
		});
	});

	describe('#removeHandler(method)', () => {
		it('should remove a method from the list of handlers', () => {
			var testChannel = new testModule('test', {}, mockClient);
			var method = function testHandler() {};
			testChannel.addHandler(method);
			testChannel.removeHandler(method)
			expect(testChannel.handlers).to.not.include(method);
		});
	});

	describe('#destroy()', () => {
		it('should append the packet and start the bundler', () => {
			var testChannel = new testModule('test', {}, mockClient);
			var clientMock = sinon.mock({
				destroy: function() {}
			});
			testChannel._client = clientMock.object;

			clientMock.expects('destroy')
				.once();

			testChannel.destroy();
			clientMock.verify();
			testChannel._client = null;
			sinon.mock.restore();
		});
	});

	describe('#handleData(payload)', () => {
		it('should call all the handlers with all the data (split batches)', () => {
			var testChannel = new testModule('test', { splitBatches: true }, mockClient);
			var spies = [1,2].map(() => {
				return sinon.spy();
			});
			var payload = [{callId: 0}, {callId: 1}];

			// Force reset
			testChannel.handlers = [];
			spies.forEach((spy) => testChannel.addHandler(spy));
			testChannel.handleData(payload);
			spies.forEach((spy) => {
				expect(spy.withArgs({callId: 0}).calledOnce).to.be.true;
				expect(spy.withArgs({callId: 1}).calledOnce).to.be.true;
			});
		});

		it('should call all the handlers with the direct payload', () => {
			var testChannel = new testModule('test', { splitBatches: false }, mockClient);
			var spies = [1,2].map(() => {
				return sinon.spy();
			});
			var payload = [{callId: 0}, {callId: 1}];

			// Force reset
			testChannel.handlers = [];
			spies.forEach((spy) => testChannel.addHandler(spy));
			testChannel.handleData(payload);
			spies.forEach((spy) => {
				expect(spy.withArgs(payload).calledOnce).to.be.true;
			});
		});
	});
});
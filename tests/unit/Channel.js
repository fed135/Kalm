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
		});
	});
});
/*
send(payload) {}

sendOnce(payload) {}

startBundler() {}

resetBundler() {}

addHandler(method, bindOnce) {}

removeHandler(method) {}

destroy() {}

handleData(payload) {}
*/
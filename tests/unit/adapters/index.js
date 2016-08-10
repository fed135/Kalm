/**
 * Adapters 
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../../src/adapters');

/* Tests ---------------------------------------------------------------------*/

describe('Adapters', () => {
	describe('#constructor()', () => {
		it('has a populated list element', () => {
			expect(testModule.list).to.be.ok;
			expect(testModule.list).to.have.all.keys(['ipc', 'tcp', 'udp']);
		});
	});

	describe('#resolve(name)', () => {
		it('can resolve a valid adapter', () => {
			var ipcTest = testModule.resolve('ipc');
			expect(ipcTest).to.be.ok;
		});

		it('handles errors', () => {
			var fooTest = testModule.resolve('foo');
			expect(fooTest).to.be.undefined;
		});
	});

	describe('#register(name, mod)', () => {
		it('can register a valid adapter', () => {
			var adapterTest = {listen: 'bar', createSocket: 'baz'};
			testModule.register('foo', adapterTest);
			expect(testModule.resolve('foo')).to.eql(adapterTest);
		});
	});
});
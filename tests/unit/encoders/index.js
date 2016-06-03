/**
 * Encoders 
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../../src/encoders');

/* Tests ---------------------------------------------------------------------*/

describe('Encoders', () => {
	describe('#constructor()', () => {
		it('has a populated list element', () => {
			expect(testModule.list).to.be.ok;
			expect(testModule.list).to.have.all.keys(['json']);
		});
	});

	describe('#resolve(name)', () => {
		it('can resolve a valid encoder', () => {
			var jsonTest = testModule.resolve('json');
			expect(jsonTest).to.be.ok;
		});

		it('handles errors', () => {
			var fooTest = testModule.resolve('foo');
			expect(fooTest).to.be.undefined;
		});
	});

	describe('#register(name, mod)', () => {
		it('can register a valid encoder', () => {
			var encoderTest = {foo: 'bar'};
			testModule.register('foo', encoderTest);
			expect(testModule.resolve('foo')).to.eql(encoderTest);
		});
	});
});
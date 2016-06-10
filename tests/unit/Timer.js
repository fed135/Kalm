/**
 * Timer class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../src/Timer');

/* Tests ---------------------------------------------------------------------*/

describe('Timer', () => {
	describe('#constructor(delay)', () => {
		it('should create a valid Timer', () => {
			var testDelay = 30;
			var result = new testModule(testDelay);
			expect(result.delay).to.be.equal(testDelay);
			expect(result.timer).to.not.be.null;
		});
	});

	describe('#start()', () => {
		it('should start the Timer', () => {

		});
	});

	describe('#stop()', () => {
		it('should stop the Timer', () => {

		});
	});
});

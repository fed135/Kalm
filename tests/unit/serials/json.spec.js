/**
 * JSON Encoder 
 * @module serials/json
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const expect = require('chai').expect;
const sinon = require('sinon');
const testModule = require('../../../src/serials/json');

/* Tests ---------------------------------------------------------------------*/

var tests = {
	strings: ['string', 'with\"\'quotes'],
	//buffers: [new Buffer('test')],
	numbers: [42, 0, Math.PI],
	booleans: [true, false],
	arrays: [[1,2,3]],
	objects: [{foo: 'bar'}]
};

function wrap(data) {
	return ['test-channel', [data]];
}

describe('JSON Encoder', () => {
	describe('#encode(payload)', () => {
		Object.keys(tests).forEach((test) => {
			it('should encode ' + test, () => {	
				tests[test].forEach((payload) => {
					expect(testModule.encode(wrap(payload))).to.be.instanceof(Buffer);
				});
			});
		});
	});

	describe('#decode(payload)', () => {
		Object.keys(tests).forEach((test) => {
			it('should decode ' + test, () => {	
				tests[test].forEach((payload) => {
					var buffer = testModule.encode(wrap(payload));
					var result = testModule.decode(buffer);
					expect(result[1][0]).to.deep.equal(payload);
				});
			});
		});
	});
});
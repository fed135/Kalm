/**
 * Client class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../src/Client');
var defaults = require('../../src/defaults');

/* Tests ---------------------------------------------------------------------*/

describe('Client', () => {
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
				socketTimeout: defaults.socketTimeout
			});
			expect(result.channels).to.not.be.object;
			expect(result.fromServer).to.be.false;
			expect(result.tick).to.be.null;
			expect(result.socket).to.not.be.null;
		});
	});

	describe('#subscribe(name, handler, options)', () => {
		it('should use/create a channel and add the handler to it', () => {

		});
	});

	describe('#unsubscribe(name, handler)', () => {
		it('should remove a handler from a channel', () => {

		});
	});

	describe('#use(socket)', () => {
		it('should replace the client\'s socket object', () => {

		});
	});

	describe('#handleError(err)', () => {
		it('should print and dispatch the error', () => {

		});
	});

	describe('#handleConnect(socket)', () => {
		it('should print and dispatch the event', () => {

		});
	});

	describe('#handleDisconnect(socket)', () => {
		it('should print and dispatch the event', () => {

		});
	});

	describe('#send(name, payload)', () => {
		it('should call send on the proper channel', () => {

		});
	});

	describe('#sendOnce(name, payload)', () => {
		it('should call sendOnce on the proper channel', () => {

		});
	});

	describe('#sendNow(name, payload)', () => {
		it('should call _emit directly', () => {

		});
	});

	describe('#createSocket(socket)', () => {
		it('should call the appropriate adapter\'s createSocket', () => {

		});
	});

	describe('#handleRequest(evt)', () => {
		it('should call handleData on the appropriate channels', () => {

		});
	});

	describe('#destroy()', () => {
		it('should call the appropriate adapter\'s disconnect', () => {

		});
	});
});

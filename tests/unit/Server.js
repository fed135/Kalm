/**
 * Server class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../src/Server');
var defaults = require('../../src/defaults');

/* Tests ---------------------------------------------------------------------*/

describe('Server', () => {
	describe('#constructor(options)', () => {
		it('should create a valid Server', () => {
			var result = new testModule();
			expect(result.id).to.be.string;
			expect(result.options).to.deep.equal({
				adapter: defaults.adapter,
				encoder: defaults.encoder,
				port: defaults.port,
				tick: defaults.tick,
				socketTimeout: defaults.socketTimeout
			});
			expect(result.connections).to.be.array;
			expect(result.channels).to.be.object;
		});
	});

	describe('#listen()', () => {
		it('should call the appropriate adapter\'s listen', () => {
			
		});
	});

	describe('#setTick(delay)', () => {
		it('should setup the server heartbeat', () => {

		});
	});

	describe('#subscribe(name, handler, options)', () => {
		it('new and existing connections subscribe to the channel and add the handler', () => {

		});
	});

	describe('#unsubscribe(name, handler)', () => {
		it('new and existing connections remove the handler from their channel', () => {

		});
	});

	describe('#dump()', () => {
		it('should dump a map of all the open sockets and pending payloads', () => {

		});
	});

	describe('#broadcast(channel, payload)', () => {
		it('should call send on all connections', () => {

		});
	});

	describe('#whisper(channel, payload)', () => {
		it('should call send on all connections that have the specified channel', () => {

		});
	});

	describe('#stop(callback)', () => {
		it('should call the appropriate adapter\'s stop', () => {

		});
	});

	describe('#createClient(options, socket)', () => {
		it('should create a new server client', () => {

		});
	});

	describe('#handleError(err)', () => {
		it('should print and dispatch the error', () => {

		});
	});

	describe('#handleRequest(socket)', () => {
		it('should push the new connection and dispatch connection events', () => {

		});
	});
});

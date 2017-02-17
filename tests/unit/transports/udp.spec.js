/**
 * UDP connector methods
 * @module transports/udp
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const expect = require('chai').expect;
const sinon = require('sinon');
const testModule = require('../../../src/transports/udp');

const dgram = require('dgram');

/* Tests ---------------------------------------------------------------------*/

describe('UDP', () => {
	describe('#listen(server, callback)', () => {

		afterEach(() => sinon.mock.restore());
		
		it('should bind to a defined port', (done) => {

			var dgramMock = sinon.mock(dgram);
			var port = 9000;
			var serverTest = { 
				listener: null, 
				handleError: function(){},
				options: {
					port: port
				}
			};
			var listenerTest = sinon.mock({
				on: function(){},
				bind: function(){}
			});

			dgramMock.expects('createSocket')
				.once()
				.withArgs({
					type: 'udp4',
					reuseAddr: true
				})
				.returns(listenerTest.object);

			listenerTest.expects('on')
				.twice();

			listenerTest.expects('bind')
				.once()
				.withArgs(port, '0.0.0.0');
			
			testModule.listen(serverTest, () => {
				expect(serverTest.listener).to.be.not.null;
				listenerTest.verify();
				dgramMock.verify();
				done();
			});
		});
	});

	describe('#stop(server, callback)', () => {
		it('should disconnect all sockets and close the server', (done) => {
			var clientStub = sinon.stub(testModule, 'disconnect');
			var serverClose = sinon.spy();
			var clients = {
				a: 'a',
				b: 'b',
				c: 'c'
			};

			var testServer = {
				__clients: clients,
				listener: {
					close: serverClose
				}
			};

			testModule.stop(testServer, () => {
				expect(clientStub.withArgs('a').called).to.be.true;
				expect(clientStub.withArgs('b').called).to.be.true;
				expect(clientStub.withArgs('c').called).to.be.true;
				expect(serverClose.calledOnce).to.be.true;
				clientStub.restore();
				done();
			});
		});
	});

	describe('#send(socket, payload)', () => {
		it('should send the payload through the socket', () => {
			var testPayload = new Buffer(JSON.stringify({foo:'bar'}));
			var socketMock = sinon.mock({
				send: function() {},
				__port: 9000,
				__hostname: '0.0.0.0'
			});

			socketMock.expects('send')
				.once()
				.withArgs(
					testPayload,
					0,
					testPayload.length,
					9000,
					'0.0.0.0'
				);

			testModule.send(socketMock.object, testPayload);
			socketMock.verify();
		});
	});

	describe('#createSocket(client, socket)', () => {
		it('should create a socket client and return it', () => {
			var dgramMock = sinon.mock(dgram);

			dgramMock.expects('createSocket')
				.once()
				.withArgs('udp4')
				.returns({
					on: function() {},
					bind: function() {}
				});

			var result = testModule.createSocket({
				options: {
					hostname: '0.0.0.0',
					port: 9000
				},
				handleError: function() {},
				handleConnect: function() {},
				handleRequest: function() {}
			});

			expect(result.__port).to.equal(9000);
			expect(result.__hostname).to.equal('0.0.0.0');
			dgramMock.verify();
		});
	});

	describe('#disconnect(client)', () => {
		it('should call the client\'s disconnect method', () => {
			var testSocket = {foo: 'bar'};
			var clientMock = sinon.mock({
				handleDisconnect: function() {},
				socket: testSocket
			});

			clientMock.expects('handleDisconnect')
				.once();

			testModule.disconnect(clientMock.object);
			
			setTimeout(() => {
				clientMock.verify();
				done();
			}, 10);
		});
	});
});
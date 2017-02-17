/**
 * TCP connector methods
 * @module transports/tcp
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const expect = require('chai').expect;
const sinon = require('sinon');
const testModule = require('../../../src/transports/tcp');

const net = require('net');

const EventEmitter = require('events').EventEmitter;

/* Tests ---------------------------------------------------------------------*/

describe('TCP', () => {
	describe('#listen(server, callback)', () => {

		afterEach(() => sinon.mock.restore());

		it('should bind to a defined port', (done) => {

			var netMock = sinon.mock(net);
			var port = 9000;
			var serverTest = { 
				listener: null, 
				handleError: function(){},
				handleRequest: function(){},
				options: {
					port: port
				}
			};
			var listenerTest = sinon.mock({
				on: function(){},
				listen: function(port, callback){
					callback();
				}
			});

			netMock.expects('createServer')
				.once()
				.returns(listenerTest.object);

			listenerTest.expects('on')
				.once()
				.withArgs('error');

			listenerTest.expects('listen')
				.once()
				.withArgs(port);
			
			testModule.listen(serverTest);

			expect(serverTest.listener).to.be.not.null;
			listenerTest.verify();
			netMock.verify();
			done();
		});
	});

	describe('#stop(server, callback)', () => {
		it('should disconnect all sockets and close the server', (done) => {
			var clientStub = sinon.stub(testModule, 'disconnect');
			var serverClose = sinon.spy();

			var testServer = {
				listener: {
					close: serverClose
				}
			};

			testModule.stop(testServer);
			
			expect(serverClose.calledOnce).to.be.true;
			clientStub.restore();
			done();
		});
	});

	describe('#send(socket, payload)', () => {
		it('should send the payload through the socket', () => {
			var testPayload = new Buffer(JSON.stringify({foo:'bar'}));
			var socketMock = sinon.mock({
				write: function() {}
			});

			socketMock.expects('write')
				.twice();

			testModule.send(socketMock.object, testPayload);
			socketMock.verify();
		});
	});

	describe('#createSocket(client, socket)', () => {
		it('should create a socket client and return it', () => {
			var netMock = sinon.mock(net);

			netMock.expects('connect')
				.once()
				.withArgs(9000, '0.0.0.0')
				.returns({
					on:function() {},
					pipe: function() {
						return new EventEmitter();
					},
					setTimeout: function() {},
					connect: function() {}
				});

			var result = testModule.createSocket({
				options: {
					hostname: '0.0.0.0',
					port: 9000
				},
				handleError: function() {},
				handleConnect: function() {},
				handleRequest: function() {},
				handleDisconnect: function() {}
			});

			netMock.verify();
		});
	});

	describe('#disconnect(client)', () => {
		it('should call the client\'s disconnect method', () => {
			var testSocket = {
				destroy: function() {}
			};
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
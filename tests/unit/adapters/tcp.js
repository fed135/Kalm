/**
 * TCP connector methods
 * @module adapters/tcp
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var expect = require('chai').expect;
var sinon = require('sinon');
var testModule = require('../../../src/adapters/tcp');

var net = require('net');

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
				end: function() {},
				once: function() {}
			});

			socketMock.expects('end')
				.once()
				.withArgs(testPayload);

			/*
			// For subsequent calls
			socketMock.expects('once')
				.once()
				.withArgs('drain');
			*/

			testModule.send(socketMock.object, testPayload);
			socketMock.verify();
		});
	});

	describe('#createSocket(client, socket)', () => {
		it('should create a socket client and return it', () => {
			var netMock = sinon.mock(net);

			netMock.expects('Socket')
				.once()
				.withArgs({ allowHalfOpen: true })
				.returns({
					on:function() {},
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
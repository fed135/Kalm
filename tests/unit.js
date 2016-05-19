/**
 * Kalm unit test suite
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var assert = require('chai').assert;
var Kalm = require('../index');
var Channel = require('../src/Channel');
var EventEmitter = require('events').EventEmitter;

/* Suite --------------------------------------------------------------------*/

var adapterFormat = {
	listen: function() {},
	send: function() {},
	stop: function() {},
	createSocket: function() {},
	disconnect: function() {}
};

var encoderFormat = {
	encode: function() {},
	decode: function() {}
};

/* Suite ---------------------------------------------------------------------*/

describe('Index', () => {
	it('Kalm', () => {
		assert.property(Kalm, 'Client', 'Client not exposed in Kalm index');
		assert.property(Kalm, 'Server', 'Server not exposed in Kalm index');
		assert.property(Kalm, 'adapters', 'adapters not exposed in Kalm index');
		assert.property(Kalm, 'encoders', 'encoders not exposed in Kalm index');
		assert.property(Kalm, 'defaults', 'defaults not exposed in Kalm index');
	});
});

describe('Adapters', () => {

	it('index', () => {
		assert.isFunction(Kalm.adapters.register, 'register method not valid in Kalm adapters');
		assert.isFunction(Kalm.adapters.resolve, 'resolve method not valid in Kalm adapters');
	});

	describe('bundled', () => {
		it('ipc', () => {
			var ipc_test = Kalm.adapters.resolve('ipc');
			assert.isObject(ipc_test, 'ipc is not a valid adapter object');
			allMembersTypeMatch(ipc_test, adapterFormat);
		});

		it('tcp', () => {
			var tcp_test = Kalm.adapters.resolve('tcp');
			assert.isObject(tcp_test, 'tcp is not a valid adapter object');
			allMembersTypeMatch(tcp_test, adapterFormat);
		});

		it('udp', () => {
			var udp_test = Kalm.adapters.resolve('udp');
			assert.isObject(udp_test, 'udp is not a valid adapter object');
			allMembersTypeMatch(udp_test, adapterFormat);
		});
	});

	describe('methods', () => {
		it('register', () => {
			Kalm.adapters.register('test', adapterFormat);
			Kalm.adapters.register('test2', null);
		});

		it('resolve', () => {
			assert.deepEqual(Kalm.adapters.resolve('test'), adapterFormat);
			assert.equal(Kalm.adapters.resolve('test2'), null);
			assert.equal(Kalm.adapters.resolve('test3'), null);
		});
	});
});

describe('Encoders', () => {

	it('index', () => {
		assert.isFunction(Kalm.encoders.register, 'register method not valid in Kalm encoders');
		assert.isFunction(Kalm.encoders.resolve, 'resolve method not valid in Kalm encoders');
	});

	describe('bundled', () => {
		var objTest = {foo: 'bar'};
		var strTest = '{"foo":"bar}';

		it('json', () => {
			var json_test = Kalm.encoders.resolve('json');
			assert.isObject(json_test, 'json is not a valid encoder object');
			allMembersTypeMatch(json_test, encoderFormat);

			assert.instanceOf(json_test.encode(objTest), Buffer, 'json encoder does not output a buffer');
			assert.deepEqual(json_test.decode(json_test.encode(objTest)), objTest, 'Object is not the same after json decoding.');
		});

		it('msg-pack', () => {
			var msg_test = Kalm.encoders.resolve('msg-pack');
			assert.isObject(msg_test, 'msg-pack is not a valid encoder object');
			allMembersTypeMatch(msg_test, encoderFormat);

			assert.instanceOf(msg_test.encode(objTest), Buffer, 'msg-pack encoder does not output a buffer');
			assert.deepEqual(msg_test.decode(msg_test.encode(objTest)), objTest, 'Object is not the same after msg-pack decoding.');
		});
	});

	describe('methods', () => {
		it('register', () => {
			Kalm.encoders.register('test', encoderFormat);
			Kalm.encoders.register('test2', null);
		});

		it('resolve', () => {
			assert.deepEqual(Kalm.encoders.resolve('test'), encoderFormat);
			assert.equal(Kalm.encoders.resolve('test2'), null);
			assert.equal(Kalm.encoders.resolve('test3'), null);
		});
	});
});

describe('Channel', () => {
	
	var channel = new Channel('test', Kalm.defaults.bundler, {
		_emit: function() {},
		destroy: function() {}
	});

	it('constructor', () => {
		assert.equal(channel.name, 'test');
		assert.deepEqual(channel.options, Kalm.defaults.bundler);
		assert.equal(channel.splitBatches, true);
	});

	it('send', (done) => {
		channel.send('foo');
		assert.isNotNull(channel._timer);
		channel.send('foo2');
		assert.include(channel._packets, 'foo');
		assert.include(channel._packets, 'foo2');

		setTimeout(() => {
			assert.equal(channel._packets.length, 0);
			assert.isNull(channel._timer);
			done();
		}, Kalm.defaults.bundler.delay + 1);
	});

	it('sendOnce', (done) => {
		channel.sendOnce('foo');
		assert.isNotNull(channel._timer);
		assert.include(channel._packets, 'foo');
		channel.sendOnce('foo2');
		assert.notInclude(channel._packets, 'foo');
		assert.include(channel._packets, 'foo2');

		setTimeout(() => {
			assert.equal(channel._packets.length, 0);
			assert.isNull(channel._timer);
			done();
		}, Kalm.defaults.bundler.delay + 1);
	});

	it('addHandler', () => {
		var testHandler = function foo() {};

		channel.addHandler(testHandler);
		assert.include(channel._handlers, testHandler);
	});

	it('removeHandler', () => {
		var testHandler = function foobar() {};

		channel.addHandler(testHandler);
		channel.removeHandler(testHandler);
		assert.notInclude(channel._handlers, testHandler);
	});

	it('handleData', (done) => {
		var testHandler = function(data) {
			done();
		};

		channel.addHandler(testHandler);
		channel.handleData(['callDone']);
	});

	it('destroy', () => {
		channel.destroy();
	});
});

describe('Client', () => {
	var testSocket = new EventEmitter();
	var testHandler = function() {};
	var client = new Kalm.Client(testSocket, {
		adapter: 'ipc', 
		port: 9000,
		channels: { 
			test: testHandler
		}
	});

	it('constructor', () => {
		assert.deepEqual(client.options, {
			hostname: Kalm.defaults.hostname,
			port: 9000,
			adapter: 'ipc',
			bundler: Kalm.defaults.bundler,
			encoder: Kalm.defaults.encoder,
			stats: Kalm.defaults.stats,
		});

		assert.isNull(client.tick);
		assert.property(client.channels, 'test');
		assert.instanceOf(client.channels.test, Channel);

		assert.isNotNull(client.socket);
	});

	it('subscribe', () => {
		var testHandler = function bar() {};
		client.subscribe('test-subscribe', testHandler);
		assert.instanceOf(client.channels['test-subscribe'], Channel);
		assert.include(client.channels['test-subscribe']._handlers, testHandler);
		client.subscribe('test-subscribe-delay', testHandler, {delay:1});
		assert.equal(client.channels['test-subscribe-delay'].options.delay, 1);
	});

	it('unsubscribe', () => {
		var testHandler = function unbar() {};
		client.subscribe('test-unsubscribe', testHandler);
		client.unsubscribe('test-unsubscribe', testHandler);
		assert.notInclude(client.channels['test-unsubscribe']._handlers, testHandler);
	});

	it('use', () => {
		var socketReplacement = new EventEmitter();
		client.use(socketReplacement);
		assert.isNotNull(client.socket);
	});

	it('handleError', (done) => {
		client.once('error', () => {
			done();
		});

		client.handleError('test');
	});

	it('handleConnect', (done) => {
		client.once('connect', () => {
			client.once('connection', () => {
				done();
			});

			client.handleConnect();
		});

		client.handleConnect();
	});

	it('handleDisconnect', (done) => {
		client.once('disconnect', () => {
			client.once('disconnection', () => {
				done();
			});

			client.handleDisconnect();
		});

		client.handleDisconnect();
	});

	it('send', () => {
		client.send('test-send', 'test1');
		client.send('test-send', 'test2');
		assert.instanceOf(client.channels['test-send'], Channel);
		assert.equal(client.channels['test-send']._packets.length, 2);
	});

	it('sendOnce', () => {
		client.sendOnce('test-sendOnce', 'test1');
		client.sendOnce('test-sendOnce', 'test2');
		assert.instanceOf(client.channels['test-sendOnce'], Channel);
		assert.equal(client.channels['test-sendOnce']._packets.length, 1);
	});

	it('handleRequest', (done) => {
		var testPayload = ['test-handleRequest', [{foo: 'bar'}]];

		client.subscribe('test-handleRequest', (data) => {
			assert.deepEqual(data, testPayload[1][0]);
			done();
		});

		client.handleRequest(Kalm.encoders.resolve('msg-pack').encode(testPayload));
	});

	it('destroy', () => {
		client.destroy();
		assert.isNull(client.socket);
	});
});

describe('Server', () => {
	var fooHandler = function() {};
	var server;

	it('constructor', (done) => {
		server = new Kalm.Server({
			adapter: 'ipc',
			port: 9000,
			channels: {
				'foo': fooHandler
			}
		});

		server.on('ready', () => {
			assert.isNotNull(server.listener);
			assert.deepEqual(server.options, {
				adapter: 'ipc',
				encoder: Kalm.defaults.encoder,
				port: 9000,
				tick: Kalm.defaults.tick
			});
			assert.isArray(server.connections);
			assert.isObject(server.channels);
			assert.equal(server.channels.foo, fooHandler);
			done();
		});
	});

	it('handleRequest', () => {
		var testSocket = new EventEmitter();
		server.handleRequest(testSocket);
		assert.equal(server.connections.length, 1);
		assert.instanceOf(server.connections[0], Kalm.Client);
	});

	it('subscribe', () => {
		var testHandler = function bar() {};
		server.subscribe('test-subscribe', testHandler);
		assert.instanceOf(server.connections[0].channels['test-subscribe'], Channel);
		assert.include(server.connections[0].channels['test-subscribe']._handlers, testHandler);
		server.subscribe('test-subscribe-delay', testHandler, {delay:1});
		assert.equal(server.connections[0].channels['test-subscribe-delay'].options.delay, 1);
	});

	it('unsubscribe', () => {
		var testHandler = function unbar() {};
		server.subscribe('test-unsubscribe', testHandler);
		server.unsubscribe('test-unsubscribe', testHandler);
		assert.notInclude(server.connections[0].channels['test-unsubscribe']._handlers, testHandler);
	});

	it('broadcast', () => {
		var testSocket = new EventEmitter();
		server.handleRequest(testSocket);
		assert.equal(server.connections.length, 2);
		server.broadcast('test-broadcast', 'test');
		assert.include(server.connections[0].channels['test-broadcast']._packets, 'test');
		assert.include(server.connections[1].channels['test-broadcast']._packets, 'test');
	});

	it('whisper', () => {
		server.connections[0].subscribe('test-whisper');
		server.whisper('test-whisper', 'test');
		assert.include(server.connections[0].channels['test-whisper']._packets, 'test');
		assert.isUndefined(server.connections[1].channels['test-whisper']);
	});

	it('handleError', (done) => {
		server.once('error', () => {
			done();
		});

		server.handleError('test');
	});

	it('stop', (done) => {
		server.stop(() => {
			assert.isNull(server.listener);
			assert.equal(server.connections.length, 0);
			done();
		});
	});
});

/* Tooling -------------------------------------------------------------------*/

/**
 * Checks that all properties are present and of the proper type
 */
function allMembersTypeMatch(set1, model) {
	for (var i in model) {
		var type = typeof model[i];
		assert.property(set1, i, 'property ' + i + ' is missing');
		assert.typeOf(set1[i], type, 'property ' + i + ' should be ' + type);
	}
	return true;
}
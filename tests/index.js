/**
 * Kalm test suite
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var assert = require('chai').assert;
var Kalm = require('../index');
var Channel = require('../src/Channel');
var EventEmitter = require('events').EventEmitter;

/* Models --------------------------------------------------------------------*/

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
		channels: { 
			test: testHandler
		}
	});

	it('constructor', () => {
		assert.deepEqual(client.options, {
			hostname: Kalm.defaults.hostname,
			port: Kalm.defaults.port,
			adapter: 'ipc',
			bundler: Kalm.defaults.bundler,
			encoder: Kalm.defaults.encoder
		});

		assert.property(client.channels, 'test');
		assert.instanceOf(client.channels.test, Channel)

		assert.isNotNull(client.socket);
	});

	it('subscribe', () => {
		client.subscribe('foo', function bar() {});
	});

	it('unsubscribe', () => {
		client.unsubscribe('foo', function bar() {});
	});

	it('use', () => {});

	it('handleError', () => {});

	it('handleConnect', () => {});

	it('handleDisconnect', () => {});

	it('send', () => {});

	it('sendOnce', () => {});

	it('createSocket', () => {});

	it('handleRequest', () => {});

	it('destroy', () => {});
});

describe('Server', () => {
	var server = new Kalm.Server({adapter: 'ipc'});

	it('constructor', () => {

	});

	it('listen', () => {});

	it('subscribe', () => {});

	it('unsubscribe', () => {});

	it('broadcast', () => {});

	it('whisper', () => {});

	it('createClient', () => {});

	it('handleError', () => {});

	it('handleRequest', () => {});

	it('stop', () => {});
});

describe('Smoke test', () => {
	var server;
	var client;

	it('run ipc + json', (done) => {
		server = new Kalm.Server({adapter:'ipc', encoder:'json'});
		server.subscribe('test', (data) => {
			assert.deepEqual(data, {foo:'bar'});
			server.stop(done);
		});

		server.on('ready', () => {
			client = new Kalm.Client({adapter:'ipc', encoder:'json'});
			client.send('test', {foo:'bar'});
		});
	});

	it('run ipc + msg-pack', (done) => {
		server = new Kalm.Server({adapter:'ipc', encoder: 'msg-pack'});
		server.subscribe('test', (data) => {
			assert.deepEqual(data, {foo:'bar'});
			server.stop(done);
		});

		server.on('ready', () => {
			client = new Kalm.Client({adapter:'ipc', encoder: 'msg-pack'});
			client.send('test', {foo:'bar'});
		});
	});

	it('run tcp + json', (done) => {
		server = new Kalm.Server({adapter:'tcp', encoder:'json'});
		server.subscribe('test', (data) => {
			assert.deepEqual(data, {foo:'bar'});
			server.stop(done);
		});

		server.on('ready', () => {
	 		client = new Kalm.Client({adapter:'tcp', encoder:'json'});
			client.send('test', {foo:'bar'});
		});
	});

	it('run tcp + msg-pack', (done) => {
		server = new Kalm.Server({encoder: 'msg-pack', adapter:'tcp'});
		server.subscribe('test', (data) => {
			assert.deepEqual(data, {foo:'bar'});
			server.stop(done);
		});

		server.on('ready', () => {
	 		client = new Kalm.Client({encoder: 'msg-pack', adapter:'tcp'});
			client.send('test', {foo:'bar'});
		});
	});

	it('run udp + json', (done) => {
		server = new Kalm.Server({adapter:'udp', encoder:'json'});
		server.subscribe('test', (data) => {
			assert.deepEqual(data, {foo:'bar'});
			server.stop(done);
		});

		server.on('ready', () => {
	 		client = new Kalm.Client({adapter:'udp', encoder:'json'});
			client.send('test', {foo:'bar'});
		});
	});

	it('run udp + msg-pack', (done) => {
		server = new Kalm.Server({encoder: 'msg-pack', adapter:'udp'});
		server.subscribe('test', (data) => {
			assert.deepEqual(data, {foo:'bar'});
			server.stop(done);
		});

		server.on('ready', () => {
			client = new Kalm.Client({encoder: 'msg-pack', adapter:'udp'});
			client.send('test', {foo:'bar'});
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
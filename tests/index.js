/**
 * Kalm test suite
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var assert = require('chai').assert;
var Kalm = require('../index');

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

var middlewareFormat = {
	process: function() {}
};

/* Suite ---------------------------------------------------------------------*/

describe('Index', function() {
	it('Kalm', function() {
		assert.property(Kalm, 'Client', 'Client not exposed in Kalm index');
		assert.property(Kalm, 'Server', 'Server not exposed in Kalm index');
		assert.property(Kalm, 'adapters', 'adapters not exposed in Kalm index');
		assert.property(Kalm, 'encoders', 'encoders not exposed in Kalm index');
		assert.property(Kalm, 'middleware', 'middleware not exposed in Kalm index');
	});
});

describe('Adapters', function() {

	it('index', function() {
		assert.isFunction(Kalm.adapters.register, 'register method not valid in Kalm adapters');
		assert.isFunction(Kalm.adapters.resolve, 'resolve method not valid in Kalm adapters');
	});

	describe('bundled', function() {
		it('ipc', function() {
			var ipc_test = Kalm.adapters.resolve('ipc');
			assert.isObject(ipc_test, 'ipc is not a valid adapter object');
			allMembersTypeMatch(ipc_test, adapterFormat);
		});

		it('tcp', function() {
			var tcp_test = Kalm.adapters.resolve('tcp');
			assert.isObject(tcp_test, 'tcp is not a valid adapter object');
			allMembersTypeMatch(tcp_test, adapterFormat);
		});

		it('udp', function() {
			var udp_test = Kalm.adapters.resolve('udp');
			assert.isObject(udp_test, 'udp is not a valid adapter object');
			allMembersTypeMatch(udp_test, adapterFormat);
		});
	});

	describe('methods', function() {
		it('register', function() {
			Kalm.adapters.register('test', adapterFormat);
			Kalm.adapters.register('test2', null);
		});

		it('resolve', function() {
			assert.deepEqual(Kalm.adapters.resolve('test'), adapterFormat);
			assert.equal(Kalm.adapters.resolve('test2'), null);
			assert.equal(Kalm.adapters.resolve('test3'), null);
		});
	});
});

describe('Encoders', function() {

	it('index', function() {
		assert.isFunction(Kalm.encoders.register, 'register method not valid in Kalm encoders');
		assert.isFunction(Kalm.encoders.resolve, 'resolve method not valid in Kalm encoders');
	});

	describe('bundled', function() {
		var objTest = {foo: 'bar'};
		var strTest = '{"foo":"bar}';

		it('json', function() {
			var json_test = Kalm.encoders.resolve('json');
			assert.isObject(json_test, 'json is not a valid encoder object');
			allMembersTypeMatch(json_test, encoderFormat);

			assert.instanceOf(json_test.encode(objTest), Buffer, 'json encoder does not output a buffer');
			assert.deepEqual(json_test.decode(json_test.encode(objTest)), objTest, 'Object is not the same after json decoding.');
		});

		it('msg-pack', function() {
			var msg_test = Kalm.encoders.resolve('msg-pack');
			assert.isObject(msg_test, 'msg-pack is not a valid encoder object');
			allMembersTypeMatch(msg_test, encoderFormat);

			assert.instanceOf(msg_test.encode(objTest), Buffer, 'msg-pack encoder does not output a buffer');
			assert.deepEqual(msg_test.decode(msg_test.encode(objTest)), objTest, 'Object is not the same after msg-pack decoding.');
		});
	});

	describe('methods', function() {
		it('register', function() {
			Kalm.encoders.register('test', encoderFormat);
			Kalm.encoders.register('test2', null);
		});

		it('resolve', function() {
			assert.deepEqual(Kalm.encoders.resolve('test'), encoderFormat);
			assert.equal(Kalm.encoders.resolve('test2'), null);
			assert.equal(Kalm.encoders.resolve('test3'), null);
		});
	});
});

describe('Middleware', function() {
	it('index', function() {
		assert.isFunction(Kalm.middleware.register, 'register method not valid in Kalm middleware');
	});

	describe('methods', function() {
		it('register', function() {
			Kalm.middleware.register('test', middlewareFormat);
			Kalm.middleware.register('test2', null);
		});

		it('process', function(done) {
			Kalm.middleware.process({
				packets: { testChannel: [] },
				options: { transform: { bundler: null } }
			}, function(channel) {
				assert.equal(channel, 'testChannel', 'bundler channel matches');
				done();
			}, 'testChannel', null);
		});
	});
});

describe('Smoke test', function() {
	it('run ipc + json', function(done) {
		var server = new Kalm.Server();
		server.channel('test', function(data) {
			assert.deepEqual(data, {foo:'bar'});
			server.stop(done);
		});

		server.on('ready', function() {
			var client = new Kalm.Client();
			client.send('test', {foo:'bar'});
		});
	});

	it('run ipc + msg-pack', function(done) {
		var server = new Kalm.Server({encoder: 'msg-pack'});
		server.channel('test', function(data) {
			assert.deepEqual(data, {foo:'bar'});
			server.stop(done);
		});

		server.on('ready', function() {
			var client = new Kalm.Client({encoder: 'msg-pack'});
			client.send('test', {foo:'bar'});
		});
	});

	it('run tcp + json', function(done) {
		var server = new Kalm.Server({adapter:'tcp'});
		server.channel('test', function(data) {
			assert.deepEqual(data, {foo:'bar'});
			server.stop(done);
		});

		server.on('ready', function() {
			var client = new Kalm.Client({adapter:'tcp'});
			client.send('test', {foo:'bar'});
		});
	});

	it('run ipc + msg-pack', function(done) {
		var server = new Kalm.Server({encoder: 'msg-pack', adapter:'tcp'});
		server.channel('test', function(data) {
			assert.deepEqual(data, {foo:'bar'});
			server.stop(done);
		});

		server.on('ready', function() {
			var client = new Kalm.Client({encoder: 'msg-pack', adapter:'tcp'});
			client.send('test', {foo:'bar'});
		});
	});

	it('run udp + json', function(done) {
		var server = new Kalm.Server({adapter:'udp'});
		server.channel('test', function(data) {
			assert.deepEqual(data, {foo:'bar'});
			server.stop(done);
		});

		server.on('ready', function() {
			var client = new Kalm.Client({adapter:'udp'});
			client.send('test', {foo:'bar'});
		});
	});

	it('run udp + msg-pack', function(done) {
		var server = new Kalm.Server({encoder: 'msg-pack', adapter:'udp'});
		server.channel('test', function(data) {
			assert.deepEqual(data, {foo:'bar'});
			server.stop(done);
		});

		server.on('ready', function() {
			var client = new Kalm.Client({encoder: 'msg-pack', adapter:'udp'});
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
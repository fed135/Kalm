/**
 * Kalm smoke test suite
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var assert = require('chai').assert;
var Kalm = require('../index');

/* Suite --------------------------------------------------------------------*/

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
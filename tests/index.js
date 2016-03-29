var assert = require('chai').assert;
var Kalm = require('../index');

describe('Starting service', function() {
	it('constructor', function(done) {
		var server = new Kalm.Server({
			port: 3000,
			adapter: 'ipc',
			encoder: 'msg-pack'
		});

		server.on('ready', function() {
			var client = new Kalm.Client({
				port: 3000, 
				adapter: 'ipc', 
				encoder:'msg-pack', 
				hostname: '0.0.0.0'
			});
			client.send('test', 'data');
			client.send('test', 'data2');

			client.send('test2', 'data3');
			done();
		});

		server.on('error', function(err) {
			console.log('Server error:');
			console.log(err.stack);
		});
	});
});
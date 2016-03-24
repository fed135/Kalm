var assert = require('chai').assert;
var Kalm = require('../../index');

describe('Starting service', function() {
	it('constructor', function(done) {
		console.log('test');
		console.log(Kalm);
		var server = new Kalm.Server({
			port: 3000,
			adapter: 'ipc',
			encoder: 'msg-pack'
		}).then(function(server) {
			var client = new Kalm.Client({
				port: 3000, 
				adapter: 'ipc', 
				encoder:'msg-pack', 
				hostname: '0.0.0.0'
			});
			client.channel('rare_pepes').send('kalm_pepe');
			client.channel('rare_pepes').send('kalm_doge');

			client.channel().send('klam klam');
			done();
		},
		function(err) {
			console.log('Server error:');
			console.log(err.stack);
		});
	});

	// it('check components', function() {
		// require('./components')(server);	
	// });
});
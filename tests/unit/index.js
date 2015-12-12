var assert = require('chai').assert;
var Kalm = require('../../index');

var server;
var config = {
	mock: true,
	debug: {
		noColor: true
	},
	connections: {
		ipc: {
			path: '/tmp/test-',
			port: 94000
		},
		tcp: {
			port: 9500
		},
		udp: {
			port: 9600
		}
	},
	services: {
		'unit.test': {
			port: 95000
		}
	}
};

describe('Starting service', function() {
	it('constructor', function(done) {
		server = Kalm.create(config);
		server.onReady.add(done);
	});

	it('check components', function() {
		require('./components')(server);	
	});
});
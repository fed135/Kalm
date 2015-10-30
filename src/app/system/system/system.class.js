var os = require('os');

function main(resolve) {
	var _defaultAddress = '127.0.0.1';
	var _currAddress = null;
	var interfaces = os.networkInterfaces();
	var cl = K.getComponent('console');

	cl.log(' - Initializing system class');

	Object.keys(interfaces).forEach(function(i) {
		interfaces[i].forEach(function(e) {
			if (!_currAddress) {
				if (e.family === 'IPv4' && !e.internal) {
					_currAddress = e.address;
				}
			}
		});
	});

	this.location = _currAddress || _defaultAddress;
	this.arch = os.arch();
	this.platform = os.platform();

	K.onReady.add(function(){
			var services = K.getComponent('services');

			//call friend
			var friend = services.create('friend', {
				port:'3001',
				adapter: 'tcp'
			});
			friend.onRequest.add(function(response) {
				console.log('pong');
				setTimeout(function() {
					friend.socket().send('hello')
				}, 2000);
			});
			friend.socket().send('hello');
	});

	//Look for serviceId, maybe it has filters
	//Filters can also attach to methods, should be the end of it.
	//Devs using Kalm only setup services and their filters

	resolve();
}

module.exports = {
	pkgName: 'system',
	attributes: {},
	methods: {
		_init: main
	}
};
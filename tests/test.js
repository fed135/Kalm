var Kalm = require('../index');

var server = new Kalm.Server({
	port: 3000,
	adapter: 'ipc',
	encoder: 'msg-pack'
});

server.on('connection', function(client) {
	console.log('client');
	console.log(client);
});

server.on('ready', function() {
	var client = new Kalm.Client({
		port: 3000, 
		adapter: 'ipc', 
		encoder:'msg-pack', 
		hostname: '0.0.0.0'
	});

	client.channel('rare_pepes').send('kalm_pepe');
	client.channel('rare_pepes').send('kalm_doge');

	client.channel().send('klam klam');
});
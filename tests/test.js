var Kalm = require('../index');

var server = new Kalm.Server({
	port: 3000,
	adapter: 'ipc',
	encoder: 'msg-pack',
	channels: {
		channel1: function(data) {
			console.log('GOT "' + data + '" on channel1!');
		},
		'/': function(data) {
			console.log('GOT "' + data + '" on main channel!');
		}
	}
});

server.on('connection', function(client) {
	// Do stuff
	client.send('greetings', 'Hi there!');
});

server.on('ready', function() {
	var client = new Kalm.Client({
		port: 3000, 
		adapter: 'ipc', 
		encoder:'msg-pack', 
		hostname: '0.0.0.0',
		channels: {
			greetings: function(data) {
				console.log('Server [greetings]: ' + data);
			}
		}
	});

	client.send('channel1', 'some data');
	client.send('channel1', 'some more data');
	setTimeout(function() {
		client.send(null, 'later sent data');
	}, 1000);
});
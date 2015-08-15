var ipc = require('node-ipc');

function send(options, message, callback) {
	ipc.of.local.emit(options.path, message, callback);
}

ipc.connectTo('local', function() {
	send(
		{
			path: '/'
		},
		'test',
		function() {
			console.log(arguments);
		}
	);
});
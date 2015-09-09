/**
 * Entry point for incomming requests
 * 
 * 1- run routing routine
 * 2- run filters
 * 3- run handler
 * 4- return formatted result
 */

function init(req) {
	var cl = K.getComponent('console');	
	var routing = K.getComponent('routing');
	var filters = K.getComponent('filters');

	//Need to add an I/O tier logging level
	cl.log('--> ' + req.method + '\t' + req.path);

	//Look for a match in routes
	var route = routing.match(req);
	if (route && route.handler) {
		filters.test(req, req.reply, route.filters, function() {
			route.handler(req, req.reply);
		});
	}
	else {
		req.reply('Page not found', 404);
	}
}

function send(options, body) {
	var connection = K.getComponent('connection');
	var system = K.getComponent('system');
	//var services = K.getComponent('services');

	var connector = 'http';

	//Check if same machine to determine connection
	//to use.
	if (options.hostname === system.location ||
		options.hostname === '127.0.0.1' ||
		options.hostname === '0.0.0.0' || 
		options.hostname === 'localhost') {
		//IPC on linux
		//ZMQ on windows
		if (system.platform === 'windows') connector = 'zmq';
		else connector = 'ipc';
	}
	else {
		if (options.connector) connector = options.connector;
		else {
		/*
		for (var i = 0; i < services.list.length; i++) {
			if (services.list[i].hostname === options.hostname) {
				connector = 'zmq';
				break;
			}
		}
		*/
		}
	}
}

module.exports = {
	methods: {
		init: init
	},
	pkgName: 'request'
};
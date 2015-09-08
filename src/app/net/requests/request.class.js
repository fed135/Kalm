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

	//Need to add an I/O tier logging level
	cl.log('--> ' + req.method + '\t' + req.path);

	//Look for a match in routes
	var route = routing.match(req);
	if (route && route.handler) {
		route.handler(req, req.reply);
	}
	else {
		req.reply('Page not found', 404);
	}
}

function send(options, body) {
	var connection = K.getComponent('connection');
	var system = K.getComponent('system');

	//Check if same machine to determine connection
	//to use.

	//Same machine : 

		//IPC on linux

		//ZMQ on windows

	//Different machine (Kalm):

		//ZMQ

	//Different machine (Ext):

		//Use specified or default to http
}

module.exports = {
	methods: {
		init: init
	},
	pkgName: 'request'
};
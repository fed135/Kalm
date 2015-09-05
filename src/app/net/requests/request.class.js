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

module.exports = {
	methods: {
		init: init
	},
	pkgName: 'request'
};
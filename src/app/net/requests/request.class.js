/**
 * Entry point for incomming requests
 * 
 * 1- run routing routine
 * 2- run filters
 * 3- run handler
 * 4- return formatted result
 */

function init(request, reply) {
	//request.path
	//request.tracking id
	//request.payload
	//request.action
	//request.handler
	//request.meta
	//(new socket)
	reply('cool');
}

module.exports = {
	methods: {
		init: init
	},
	pkgName: 'request'
};
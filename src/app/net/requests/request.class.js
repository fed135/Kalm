/**
 * Entry point for incomming requests
 * 
 * 1- run routing routine
 * 2- run filters
 * 3- run handler
 * 4- return formatted result
 */

function init(req, reply, type) {
	var cl = K.getComponent('console');

	var reqObj = {
		from: req.domain, //!
		cookie: req.headers.cookie,
		path: req.url,
		method: req.method,
		payload: req.body || null
	};

	cl.log('--> ' + reqObj.method + '\t' + reqObj.path);

	//console.log('hmmmyello');
	//console.log(reqObj);
	//request.path
	//request.tracking id
	//request.payload
	//request.action
	//request.handler
	//request.meta
	//(new socket)
	reply.end('cool');
}

module.exports = {
	methods: {
		init: init
	},
	pkgName: 'request'
};
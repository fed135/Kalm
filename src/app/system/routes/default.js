/**
 * Internal routes definition
 */

var routes = [
	{
		connector: [ 'ipc', 'zmq', 'http' ],
		method: 'GET',
		path: '/',
		handler: printManifest,
		tags: ['default'],
		filters: []
	},
	{
		connector: [ 'http' ],
		method: 'GET',
		path: '/ping/:port',
		tags: [ 'test' ],
		filter: [],
		handler: ping
	}
];


function ping(req, reply) {
	var request = K.getComponent('request');
	request.send({
		hostname:'localhost',
		path:'/',
		port:req.params.port,
		method: 'GET'
	}, function(err, data) {
		if (err) return reply(err);
		reply(data);
	});
}

function printManifest(request, reply) {
	var manifest = K.getComponent('manifest');
	reply(manifest.print());
}

module.exports = routes;
/**
 * Internal routes definition
 */

var routes = [
	{
		connector: [ 'ipc', 'zmq', 'http', 'tcp', 'udp' ],
		method: 'GET',
		path: '/',
		handler: printManifest,
		tags: ['default'],
		filters: []
	},
	{
		connector: [ 'http' ],
		method: 'GET',
		path: '/ping/:connector/:port',
		tags: [ 'test' ],
		filter: [],
		handler: ping
	}
];


function ping(req, reply) {
	var request = K.getComponent('request');
	request.send({
		hostname:'0.0.0.0',
		path:'/',
		port:req.params.port,
		method: 'GET',
		connector:req.params.connector
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
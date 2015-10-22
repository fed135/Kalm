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
	var friends = K.getComponent('friends');
	var request = K.getComponent('request');

	//DESIGN TEST
	friends.getOrCreate('local-'+req.params.connector, {
		port: req.params.port,
		adapter: req.params.connector,
		circle: 'test'
	}).send({
		path:'/'
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
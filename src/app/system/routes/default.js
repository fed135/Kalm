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
		filters: [
			function (req, reply, next) {
				//interrupt test
				reply('Unauthorized', 401);
				next();
			}
		]
	}
];


function printManifest(request, reply) {
	var manifest = K.getComponent('manifest');
	reply(manifest.print());
}

module.exports = routes;
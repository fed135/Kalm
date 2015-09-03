/**
 * Internal routes definition
 */

var routes = [
	{
		action: [ 'ipc', 'zmq', 'http' ],
		path: '/',
		handler: printManifest,
		tags: ['default']
	}
];


function printManifest(request, reply) {
	var manifest = K.getComponent('manifest');
	reply(manifest.print());
}

module.exports = routes;
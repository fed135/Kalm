//TODO: maybe put as a package

function parse(route) {
	route._setup = {};

	route.path.split('/').forEach(function(e, i) {
		if (e[0] === ':') route._setup[i] = e.substring(1);
	});

	return route;
}

function resolve(req, route) {
	var decomp = req.path.split('/');

	req.params = req.params || {};

	Object.keys(route._setup).forEach(function(e) {
		req.params[route._setup[e]] = decomp[e];
	});

	req.handler = route.handler;

	return req;
}

function match(req) {
	var routes = K.getComponent('routes');
	var i;
	var path = req.path;

	for (i = 0; i<routes.list.length; i++) {
		if (routes.list[i].connector.indexOf(req.connection) === -1) continue;
		if (routes.list[i].method !== req.method) continue;
		if (_simplifyPath(path, routes.list[i].path)) {
			req.filters = routes.list[i].filters;
			return this.resolve(req, routes.list[i]);
		} 
	}

	return false;
}

function _simplifyPath(path, route) {
	if (route.indexOf(':') === -1 && 
		route === path) return true;

	var de_route = route.split('/');
	var de_path = path.split('/');

	de_route.forEach(function(e, i, arr) {
		if (e[0] === ':') {
			arr[i] = ':';
			de_path[i] = ':';
		}
	});

	de_route = de_route.join('/');
	de_path = de_path.join('/');

	return (de_path === de_route);
}

module.exports = {
	pkgName: 'routing',
	methods: {
		parse: parse,
		resolve: resolve,
		match: match
	}
};
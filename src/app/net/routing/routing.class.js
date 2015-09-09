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

	Object.keys(route._setup).forEach(function(e) {
		req.params[route._setup[e]] = decomp[e];
	});

	req.handler = route.handler;

	return req;
}

function match(req) {
	var routes = K.getComponent('routes');
	var i;
	var path = _simplifyPath(req.path);

	for (i = 0; i<routes.list.length; i++) {
		if (routes.list[i].connector.indexOf(req.connection) === -1) continue;
		if (routes.list[i].method !== req.method) continue;
		if (path === _simplifyPath(routes.list[i].path)) {
			req.filters = routes.list[i].filters;
			return this.resolve(req, routes.list[i]);
		} 
	}

	return false;
}

function _simplifyPath(path) {
	if (path.indexOf(':') === -1) return path;

	var decomp = path.split('/');

	decomp.forEach(function(e, i, arr) {
		if (e[0] === ':') arr[i] = ':';
	});

	return decomp.join('/');
}

module.exports = {
	pkgName: 'routing',
	methods: {
		parse: parse,
		resolve: resolve,
		match: match
	}
};
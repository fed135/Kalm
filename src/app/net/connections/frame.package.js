var _requestUid = 0;

var _defaults = {
	connection: 'socket',
	reply: null,
	cookies: null,
	headers: null,
	path: '/',
	method: 'GET',
	query: {},
	payload: null,
	params: {},
	_stats: {},
	origin: null,
	authKey: null
};

function create(req) {
	var utils = K.getComponent('utils');
	var manifest = K.getComponent('manifest');

	var template = utils.object.mixin({}, _defaults);
	template.uid = manifest.id + '.' + _requestUid++;
	return utils.object.mixin(template, req);
}

module.exports = {
	create: create
};
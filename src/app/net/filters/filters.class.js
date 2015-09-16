function test(req, res, filters, callback) {
	var utils = K.getComponent('utils');

	if (!filters || filters.length === 0) {
		return callback();
	}

	function filterify(filter) {
		return function(resolve) {
			filter(req, res, resolve);
		};
	}

	utils.async.all(filters.map(filterify), callback);
}

function load(callback) {
	if (K.appConf.filters) {
		for (var i in K.appConf.filters) {
			this.list[i] = K.appConf.filters[i];
		}
	}
}

module.exports = {
	pkgName: 'filters',
	attributes: {
		list: {}
	},
	methods: {
		_init: load,
		test: test
	}
};
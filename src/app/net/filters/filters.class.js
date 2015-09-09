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

module.exports = {
	pkgName: 'filters',
	methods: {
		test: test
	}
};
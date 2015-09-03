/**
 * Utility packages
 */

/* Methods ------------------------------------------------------------------*/

function all(list, callback) {
	function _promisify(method) {
		return new Promise(method);
	}	

	Promise.all(list.map(_promisify)).then(function(val) {
		callback();
	},
	function(err) {
		callback(err || 'unhandled_error');
		cl.error('Boot failure: ');
		cl.error(err);
	});
}

/* Exports ------------------------------------------------------------------*/

module.exports = {
	all: all
};
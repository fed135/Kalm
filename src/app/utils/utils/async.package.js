/**
 * Utility packages
 */

/* Methods ------------------------------------------------------------------*/

function all(list, callback) {
	function _promisify(method) {
		return new Promise(method);
	}	

	Promise.all(list.map(_promisify)).then(function(val) {
		console.log('finishged list');
		callback();
	},
	function(err) {
		callback(err || 'unhandled_error');
		cl.error(err);
	});
}

/* Exports ------------------------------------------------------------------*/

module.exports = {
	all: all
};
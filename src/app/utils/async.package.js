/**
 * Utility packages
 * @exports {object}
 */

'use strict';

/* Methods ------------------------------------------------------------------*/

/**
 * Cheap-and dirty (but lightweight) async manager
 * @param {array} list The list of methods to complete asynchronously
 * @param {function} callback The callback method
 */
function all(list, callback) {
	//Callback-based
	var done = 0;

	list.forEach(function(e) {
		e(function() { 
			done++;
			if (done === list.length) {
				if (callback) callback();
			} 
		});
	});
}

/* Exports ------------------------------------------------------------------*/

module.exports = {
	all: all
};
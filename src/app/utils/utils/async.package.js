/**
 * Utility packages
 */

/* Methods ------------------------------------------------------------------*/

//Cheap-and dirty (but lightweight) async manager
function all(list, callback) {
	//Callback-based
	var done = 0;

	list.forEach(function(e, i) {
		e(function() { 
			done++;
			if (done === list.length) callback(); 
		});
	});
}

/* Exports ------------------------------------------------------------------*/

module.exports = {
	all: all
};
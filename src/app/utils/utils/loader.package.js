/**
 * Loader util
 */

/* Requires ------------------------------------------------------------------*/

var walk = require('walk');
var path = require('path');

/* Local variables -----------------------------------------------------------*/

/* Methods -------------------------------------------------------------------*/

/**
 * Scans a dir tree for marked files and loads them
 * @method load
 * @param {string} rootDir The directory to scan
 * @param {string} marker The marker to look for in the filename
 * @param {function} method The method to call on every matching file
 * @param {function} callback The callback method
 */
function load(rootDir, marker, method, callback) {
	var mod;
	var walker = walk.walk(rootDir, {
		followLinks: true
	});

	walker.on('file', function (root, fileStats, next) {
		if (fileStats.name.indexOf(marker) !== -1) {
			mod = require(path.join(process.cwd(), root, fileStats.name));
			method(mod, fileStats.name, next);
		}
		else next();
	});
	 
	walker.on('end', callback);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	load: load
};
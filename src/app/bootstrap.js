/**
 * Bootstrap module
 * 
 * Looks for class files and loads them in the Framework object
 */

/* Requires *******************************************************************/

var walk = require('walk');
var fs = require('fs');
var path = require('path');

/* Local variables ************************************************************/

var _classMarker = '.class.js';

/* Methods ********************************************************************/

function main(K) {
	_loadComponents(K, function() {
		console.log('load completed');
		console.log(K.getComponent('manifest'));
	});
}

function _loadComponents(K, callback) {
	var mod;
	var walker = walk.walk("./src/app", {
		followLinks: true
	});

	walker.on("file", function (root, fileStats, next) {
		if (fileStats.name.indexOf(_classMarker) !== -1) {
			mod = require(path.join(process.cwd(), root, fileStats.name));
			K.registerComponent(mod);
		}
		
		next();
	});
	 
	walker.on("errors", function (root, nodeStatsArray, next) {
		next();
	});
	 
	walker.on("end", function () {
		callback();
	});
}

/* Exports ********************************************************************/

module.exports = main;
/**
 * Kalm App singleton
 * Reference to this class will be available accross the project
 * under the global property K
 */

/* Requires ------------------------------------------------------------------*/

//Hack to get access to some modules before the class initialization
var stdUtils = require('./app/utils/utils/utils.class');
var stdOut = require('./app/system/console/console.class');
var configure = require('./app/boot/configure');

/* Methods -------------------------------------------------------------------*/

function Kalm(pkg, config) {

	this.pkg = pkg;
	this.appConf = config;
	this._components = {};

	//List of init methods, call at the end of the walk
	this.moduleInits = [];
	
	//Init already loaded modules - unclean
	this.registerComponent(stdOut);
	this.registerComponent(stdUtils);

	var utils = this.getComponent('utils');

	utils.loader.load('src/app', '.class.js', this.registerComponent.bind(this), configure);
}

Kalm.prototype.registerComponent = function(pkg, path, callback) {
	var p;

	if (!pkg.pkgName) {
		console.error('No pkg name! ' + path);
		return false;
	}

	if (this._components[pkg.pkgName]) {
		if (callback) return callback();
	}
	
	p = pkg.attributes || {};

	if (pkg.methods) {
		Object.keys(pkg.methods).forEach(function(e) {
			if (pkg.methods[e].bind) {
				p[e] = pkg.methods[e].bind(p);
			}
			else {
				console.warn(e + 'is not a method in ' + pkg.pkgName)
			}
		});
	}

	this._components[pkg.pkgName] = p;

	if (this._components[pkg.pkgName]._init) {
		this.moduleInits.push(this._components[pkg.pkgName]._init);
	}

	if (callback) callback();
};

Kalm.prototype.getComponent = function(pkgName) {
	return this._components[pkgName];
};

/* Exports -------------------------------------------------------------------*/

module.exports = Kalm;
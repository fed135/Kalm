var bootstrap = require('./app/boot/loader');
var stdOut = require('./app/system/console/console.class');

function Kalm(pkg, config) {
	this.pkg = pkg;
	this.appConf = config;
	this._components = {};

	//Load console first
	this.registerComponent(stdOut);

	bootstrap(this);
}

Kalm.prototype.registerComponent = function(pkg, path) {
	var cl = this.getComponent('console');
	var p;

	if (!pkg.pkgName) {
		cl.error('No pkg name! ' + path);
		return false;
	}
	
	p = pkg.attributes || {};

	if (pkg.methods) {
		Object.keys(pkg.methods).forEach(function(e) {
			if (pkg.methods[e].bind) {
				p[e] = pkg.methods[e].bind(p);
			}
			else {
				cl.warn(e + 'is not a method in ' + pkg.pkgName)
			}
		});
	}

	this._components[pkg.pkgName] = p;

	if (this._components[pkg.pkgName]._init) {
		this._components[pkg.pkgName]._init();
	}
};

Kalm.prototype.getComponent = function(pkgName) {
	return this._components[pkgName];
};

module.exports = Kalm;
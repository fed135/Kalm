var bootstrap = require('./app/bootstrap');

function Kalm(pkg) {
	this.pkg = pkg;
	this._components = {};

	bootstrap(this);
}

Kalm.prototype.registerComponent = function(pkg, path) {
	var _self = this;
	var p;

	if (!pkg.pkgName) {
		console.error('No pkg name! ' + path);
		return false;
	}
	
	this._components[pkg.pkgName] = pkg.attributes || {};

	if (pkg.methods) {
		Object.keys(pkg.methods).forEach(function(e) {
			p =	_self._components[pkg.pkgName];
			p[e] = pkg.methods[e].bind(p);
		});
	}

	if (this._components[pkg.pkgName]._init) {
		this._components[pkg.pkgName]._init();
	}
};

Kalm.prototype.getComponent = function(pkgName) {
	return this._components[pkgName];
};

module.exports = Kalm;
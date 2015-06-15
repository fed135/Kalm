var bootstrap = require('./app/bootstrap');
var singleton = null;

function Kalm() {
	this.comfig = {};
	this._components = {};

	bootstrap(this);
}

Kalm.prototype.registerComponent = function(pkg, path) {
	var _self = this;

	if (!pkg.pkgName) {
		console.error('No pkg name! ' + path);
		return false;
	}
	
	this._components[pkg.pkgName] = pkg.properties || {};

	if (pkg.methods) {
		Object.keys(pkg.methods).forEach(function(e) {
			_self._components[pkg.pkgName][e] = pkg.methods[e].bind(_self);
		});
	}

	if (this._components[pkg.pkgName]._init) {
		this._components[pkg.pkgName]._init();
	}
};

Kalm.prototype.getComponent = function(pkgName) {
	return this._components[pkgName];
};

singleton = new Kalm();
module.exports = singleton;
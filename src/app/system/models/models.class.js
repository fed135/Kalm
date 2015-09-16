function print() {
	var utils = K.getComponent('utils');

	return utils.object.mixin({}, this.list);
}

function register(model) {
	this.list.push(model);
}

function load(callback) {
	if (K.appConf.models && K.appConf.models.length) {
		K.appConf.models.forEach(this.register);
	}
	//TODO: only callback when done
	callback();
}

module.exports = {
	pkgName: 'models',
	attributes: {
		list: []
	},
	methods: {
		_init: load,
		register: register,
		print: print
	}
};
function register(serviceConf) {
	console.log(this);
	var request = K.getComponent('request');
	var _self = this;

	request.send(serviceConf, function(err, data) {
		_self.list.push(data);
	});
}

function unregister() {
	
}

function getKey() {

}

function match(req) {

}

function load(callback) {
	if (K.appConf.services && K.appConf.services.length) {
		K.appConf.services.forEach(this.register);
	}
	//TODO: only callback when done
	callback();
}

module.exports = {
	pkgName: 'services',
	attributes: {
		list: []
	},
	methods: {
		getKey: getKey,
		register: register,
		unregister: unregister,
		match: match,
		_init: load
	}
};
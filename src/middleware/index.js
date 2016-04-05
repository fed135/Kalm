var bundler = require('./bundler');

var list = {
	bundler: bundler
};

function process(client, emit, channel, payload) {
	for (var t in client.options.transform) {
		if (t in list) list[t].process(client, emit, channel, payload);
	}
}

function register(name, mod) {
	list[name] = mod;
}

module.exports = {
	process: process,
	register: register
};
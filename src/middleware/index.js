var bundler = require('./bundler');

var list = {
	bundler: bundler
};

function process(socket, payload) {

}

function register(name, mod) {
	list[name] = mod;
}

module.exports = {
	process: process,
	register: register
};
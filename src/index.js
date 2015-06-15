var bootstrap = require('./app/bootstrap');

function Kalm() {
	this.comfig = {};

	bootstrap.init(this);
}

module.exports = Kalm;
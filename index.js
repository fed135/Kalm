var Kalm = require('./src/Kalm');
var pkg = require('./package');

//Get config file

module.exports = function(config){
	global['K'] = new Kalm(pkg, config);
	return K;
};

var Kalm = require('./src/Kalm');
var pkg = require('./package');

//Get config file

global['K'] = new Kalm(pkg);

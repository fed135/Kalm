var Kalm = require('./src/Kalm');
var pkg = require('./package');

global['K'] = new Kalm(pkg);

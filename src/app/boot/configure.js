/**
 * Initializes modules once they are loaded
 */

/* Requires ------------------------------------------------------------------*/

var logo = require('./logo');

/* Methods -------------------------------------------------------------------*/

//print logo
//Merge config
//Put models
//Put routes and controllers
//Scan ports, assign ports to protocols,
//Start listening (tcp socket/udp socket, based on config)
//Ready ipc*/zmq
//Hold process

//*var server = http.createServer();
//server.listen('/var/tmp/http.sock'); 

function _promisify(method) {
	return new Promise(method);
}

function main() {
	var cl = K.getComponent('console');

	var _startTime = Date.now();

	Promise.all([
		_printLogo,
		_initRoutes,
		_setupConnections,
		_holdProcess
	].map(_promisify)).then(function() {
		cl.log('Server started in ' + (Date.now() - _startTime) + 'ms');
	},
	function(err) {
		cl.error('Boot failure: ');
		cl.error(err);
	});
}

function _initRoutes(resolve, reject) {
	var cl = K.getComponent('console');
	var routes = K.getComponent('routes');

	cl.log(' - Initializing routes');	

	routes.init(function(err) {
		if (err) return reject(err);
		resolve();
	});
}

function _setupConnections(resolve, reject) {
	var cl = K.getComponent('console');
	var connection = K.getComponent('connection');

	cl.log(' - Initializing connections');

	connection.init(function(err) {
		if (err) return reject(err);
		resolve();
	});
}


function _printLogo(resolve) {

	var cl = K.getComponent('console');
  cl.print(logo.big());

  cl.log('Starting service...');
  resolve();
}


function _holdProcess(resolve) {

	process.on('uncaughtException', function(err) {
		cl.error(err);
	});
  process.stdin.resume();

  resolve();
}

/* Exports -------------------------------------------------------------------*/

module.exports = main;
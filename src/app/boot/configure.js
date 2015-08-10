var logo = require('./logo');

//print logo
//Merge config
//Put models
//Put routes and controllers
//Scan ports, assign ports to protocols,
//Start listening (tcp socket/udp socket, based on config)
//Ready ipc*/zmq

//*var server = http.createServer();
//server.listen('/var/tmp/http.sock'); 

function printLogo() {
	var cl = K.getComponent('console');
  cl.print(logo.big());
}

module.exports = printLogo;
//print logo
//Merge config
//Put models
//Put routes and controllers
//Scan ports, assign ports to protocols,
//Start listening (tcp socket/udp socket, based on config)
//Ready ipc*/zmq for

//*var server = http.createServer();
//server.listen('/var/tmp/http.sock'); 

function printLogo() {
	console.log('\x1b[92m	 _         ');
	console.log('        /\\_\\      ');
	console.log('       / / /  \x1b[97m_     \x1b[92m');
	console.log('      / / /  \x1b[97m/\\_\\ \x1b[92m');
	console.log('     / / /\x1b[97m__/ / /   \x1b[92m');
	console.log('    / /\x1b[97m\\_____/ /   \x1b[92m');
	console.log('   / /\x1b[97m\\_______/    \x1b[92m');
	console.log('  / / /\x1b[94m\\ \\ \\     \x1b[92m');
	console.log(' / / /  \x1b[94m\\ \\ \\    \x1b[92m');
	console.log('/ / /    \x1b[94m\\ \\ \\   \x1b[92m');
	console.log('\\/_/      \x1b[94m\\_\\_\\ \x1b[97m    Kalm v.0.1');
	console.log('');             
}

module.exports = printLogo;
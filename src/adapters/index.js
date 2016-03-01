var ipc = require('./ipc.adapter');
var tcp = require('./tcp.adapter');
var udp = require('./udp.adapter');
var ws = require('./ws.adapter');

module.exports = {
	ipc: ipc,
	tcp: tcp,
	udp: udp,
	ws: ws
};
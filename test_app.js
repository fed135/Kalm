const Kalm = require('./');
const server = Kalm.listen({
	port: 3000
});

server.subscribe('test', (msg) => {
	console.log('Message:', msg);
});

const client = Kalm.connect({
	port: 3000
});

client.send('test', 'Hello!');
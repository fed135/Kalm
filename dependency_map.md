# Dependency map

- Server
	- connections
	- listener

- Client
	- socket

- Multiplexer
	- channels

- Queue
	- Profile
		- Timer

- Serializer

- Session
	- (TTL)

--------------------------------------------------------------


With factories


remove client/server concept -> socket


socket = function() {
	let base = Object.assign({ id }, EventEmitter.prototype);

	Objetc.assign(base,
		serverFactory(base),
		clientFactory(base)
		Server.bind(base)
	)
}



////--------------------------------- Usage tests

let s = Kalm.listen({
	profile: Kalm.profiles.DYNAMIC,	// { tick: 0, maxBytes: 0 }
	transport: Kalm.transports.TCP,
	serial: Kalm.serials.JSON,
	port: 3000
});

let c = Kalm.connect({
	host: '0.0.0.0',
	port: 3000
}, (socket) => {});

s.on('ready', () => {})
s.on('connection', (socket, session) => {})
s.on('error', () => {})
s.broadcast(channel, payload)
s.close()

(c / connection -> socket)
socket.send(channel, payload, now)
socket.subscribe(channel, handler)
socket.unsubscribe(channel, handler)
socket
	.transaction(options)
	.send(channel, payload)
	.then((res) => {})
socket.disconnect()
socket.on('disconnect')
socket.on('error')



/* ------------------------------------- transport and serial factories

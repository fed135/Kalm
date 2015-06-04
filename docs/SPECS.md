# Specs

## Wants

- RESTful API via Socket for Client-Gate-keeper communications.
Use RAML/swagger to define APIs

- ZMQ for inter-server communications.

- No need for a framework. Try to use as fewer libraries as possible.
Install process should be fast.

## Not sures

- ES6 classes (later versions of iojs)
*These are a pain to install on older systems like CentOS 6.5*

## Known Dependencies

- ZMQ
- Socket.io
- circuit-breaker
- cli-color
- debug
- chai			//Dev
- mocha			//Dev
- yuidocjs	//Dev

## Unknown dependencies

(Stuff we might need, or not sure if we want)

- joi
- portscanner
- signals
- waterline
- sails-memory
- pm2
# Specs

## Wants

- RESTful API via Socket for Client-Gate-keeper communications.
Use RAML/swagger to define APIs

- Can choose between tcp and udp socket channels for app-2-server
Great for game servers

- ZMQ for inter-server communications.

- No need for a framework. Try to use as fewer libraries as possible.
Install process should be fast.

- Interface to manage services, binding and instances
Should be able to auto-scale, deploy, everything. Simply provide AWS/ GAE key
Need scaling algorithm, dedicated + shared space logic.

- Default route = manifest

- Find a way to share filters, controllers and other components accross 
services of a same project

- Track requests accross the network. (emitter-id, request-id, origin, destination
completed?)

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

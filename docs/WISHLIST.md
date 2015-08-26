# Specs

## Wants

- Can choose between tcp and udp socket channels for app-2-server
Great for game servers

- ZMQ or ipc for inter-service communications.

- Event-based routing with payloads, no need for complex and bulky routing
software.

- Interface to manage services, binding and instances
Should be able to auto-scale, deploy, everything. Simply provide AWS/ GAE key
Need scaling algorithm, dedicated + shared space logic.

- Can share filters, controllers and other components accross 
services of a same project

- Request tracking UI

## Not sures

- ES6 classes (later versions of iojs)
*These are a pain to install on older systems like CentOS 6.5*

## Known Dependencies

- ZMQ				//Has addon!!
- circuit-breaker
- debug
- chai			//Dev
- mocha			//Dev
- portscanner
- signals

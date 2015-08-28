# Roadmap

^ [Back to home](../README.md)


## v.0.1.0

- Functionnal connectors (http, tcp socket, udp socket)
  With interface class and universal handler

- Config properly populates the routes list
  Need to figure out a pretty syntax

- ZMQ and unix sockets (ipc)
  Note: ZMQ is going to be tricky: node client has binaries deps

- Print stats, manifest, healthcheck
  {status:'ok', details:{service1: 'ok', ...}}

- Handle server up, server down and error recovery
  Add signals or w/e

- Circuit breaking
  For forwarding methods

- Port-scanning
  For connectors that use the network card

- Environments
  Add in config

- API docs
  Generated from docblocks

- Internal map
  Generated from class-loader

- Logging destination
  Provided by debug > file.log (pipe)

- Routing (connector-agnostic)
  Create event-based routing

- Handle redirection (gatekeeper)
	Keep track of request.

## Backlog

- Handle filtering middleware
  Check Sails for implementation example

- Unit tests

- Smoke tests

- Code coverage tests

- Load-balancing

- Mock mode (needs definition)
# Roadmap

^ [Back to home](../README.md)


## v.0.1.1

- Environments
  Add in config

- API docs
  Generated from docblocks

- Internal map
  Generated from class-loader

- Logging destination
  Provided by debug > file.log (pipe)

- Handle redirection (gatekeeper) - or need of
	Keep track of request.

## Backlog

- Handle filtering middleware
  Check Sails for implementation example

- Unit tests

- Smoke tests

- Code coverage tests

- Proper load-balancing strategy for pooled sockets

- Mock mode (needs definition)

## TODOs

- Better handling of service/socket update on request

- Manage unwrapped requests

- Make sure socket clients all implement closing behaviour (disconnect)

- Review app shutdown to eliminate all existing connections and hanging resources

- Add proper uid generation

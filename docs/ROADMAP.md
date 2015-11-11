# Roadmap

^ [Back to home](../README.md)


## v.1.0.2

- [x] Environments
  Add in config

- [ ] Handle redirection (gatekeeper) - or need of
  Keep track of request.

- [x] IPC adapter binds to a specified and static location (and remove 'i')

- [x] Create services from config on load

- [ ] Add reply interface (uses same socket) to handlers 

- [ ] Better handling of service/socket update on request

- [ ] Manage unwrapped requests

- [ ] Make sure socket clients all implement closing behaviour (disconnect)

- [ ] Allow 'unlimited' pool size

- [ ] Implement optionnal socket timeout

- [ ] Resolve parallel ipc and udp connection problems

- [x] Review app shutdown to eliminate all existing connections and hanging resources

## v.1.0.3

- [ ] API docs
  Generated from docblocks

- [ ] Internal map
  Generated from class-loader

- [ ] Logging destination
  Provided by debug > file.log (pipe)

- [ ] Unit tests

- [ ] Smoke tests

- [ ] Code coverage tests

- [ ] Proper load-balancing strategy for pooled sockets

- [ ] Mock mode (needs definition)

- [ ] Add scheduler

- [ ] Add proper uid generation

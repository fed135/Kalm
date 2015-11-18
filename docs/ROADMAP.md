# Roadmap

^ [Back to home](../README.md)


## v.1.0.2

- [x] Environments

- [x] IPC adapter binds to a specified and static location (and remove 'i')

- [x] Create services from config on load

- [x] Add reply interface (uses same socket) to handlers 

- [x] Better handling of service/socket update on request

- [x] Manage unwrapped requests

- [x] Handle uncaughtExceptions to prevent process from crashing

- [x] Make sure socket clients all implement closing behaviour (disconnect)

- [x] Allow 'unlimited' pool size 

- [x] Implement optionnal socket timeout

- [x] Resolve parallel ipc connections

- [x] Fix udp reply problem

- [x] Optimize tcp receiver

- [x] Minify wrapper

- [x] Review app shutdown to eliminate all existing connections and hanging resources

## v.1.0.3

- [x] API docs

- [x] Logging destination

- [x] Proper load-balancing strategy for pooled sockets

- [x] Add proper uid generation

- [x] Bug: ipc will notify sender with onRequest

- [x] Mock mode config

- [x] Feature: need to be able to add a default handler + dynamic bind to handler

## v.1.0.4

- [ ] Internal map

- [ ] Unit tests

- [ ] Smoke tests

- [ ] Add scheduler

- [ ] Recover from fatal crash - resolve already bound addresses
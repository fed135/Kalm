# Passing K to modules and packages...

K should be passed to components in prototype in
either a wrapper, or a 'parent' property of some sort

# Class migrations

- Kill manifest (not required)
- Move event into Kalm/bootstrap - never going to be needed by another module
- Config is now part of Kalm/bootstrap
- Circles move into Services.find logic

# Prototype object brainstorm

Kalm = new Kalm()

#properties
  .pkg # Kalm's package file
  .app # The App's package file
  .config # The App's config
  .controllers # The app's controllers

#methods
  .onready
  .onshutdown

-- Prototype

.Net = new Net()

#properties
  .wrapper # The call wrapper
  .adapters # The collection of adapters

#methods
  .loadAdapter

.Peers = new Peers()

#properties
  .list

#methods
  .add (Peer constructor)
  .remove
  .all
  .find

.Peer = new Peer()

#properties
  .channels #list of channels
  .label
  .uid
  .config

#methods
  .channel

.Peer.Channel = new Channel()

#methods
  .send
  .destroy
  .ondata

.Console = new Console()

#properties
  .colors

#methods
  .log
  .warn
  .error

.System = new System()

#properties
  .hostname
  .arch
  .platform

.Utils = new Utils()

#properties
  .async
  .crypto
  .object

Promisify Error-prone sections:

- Server bind,
- Server write,
- Request handling,
- Shutdown protocol

------------------------------------------

Stateless & stateful socket management

### Stateless

- Wrapped
- Anonymous pooled sockets
- Emit, Broadcast, Receive from server

### Stateful

- (Un)wrapped
- Named sockets (client channel)
--> Check if channel is present to toggle modes
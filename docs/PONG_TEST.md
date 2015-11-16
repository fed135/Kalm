# The Ping-Pong test

^ [Back to home](../README.md)

This is the benchmark test for adapter performance.
It has been (crudely) designed for the Kalm framework.

## Settings

- Must be run between two instances of a Kalm micro-service.
- Instances must not be deamonized or clustered.
- Machine configuration must be vanilla.

## Parameters

- Timer must run for a whole minute.
- Unnamed sockets are used.
- One process sends a string 'ping' to the other, which replies 'pong'.
- Service has default socket pool size and a socket timeout of 1000 ms.
- 1000 parallel sockets are sent at the beginning.
- A point is awarded for every complete back and forth trip (ping-pong).


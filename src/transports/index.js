/**
 * Adapters 
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const IPC = require('./ipc');
const TCP = require('./tcp');
const UDP = require('./udp');

/* Exports -------------------------------------------------------------------*/

module.exports = { IPC, TCP, UDP };
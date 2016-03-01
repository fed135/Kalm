/**
 * Kalm micro-service creation entry point
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Kalm = require('./src');
var pkg = require('./package');

/* Init ----------------------------------------------------------------------*/

Kalm.Client.pkg = pkg;
Kalm.Server.pkg = pkg;

/* Exports -------------------------------------------------------------------*/

module.exports = Kalm;
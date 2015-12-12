/**
 * Console methods
 * !! Avoid direct console logs, use these methods instead !!
 * @exports {Console}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var debug = require('debug');
var colors = require('./colors.package');
var stacktrace = require('./stacktrace.package');

/* Methods -------------------------------------------------------------------*/

/**
 * Console class
 * @constructor
 * @param {Kalm} K Kalm reference
 * @param {function} callback The callback method
 */
function Console(K, callback) {
	this.p = K;
	console.log('Yippe')

	var config = this.p.appConf;

	for (var c in colors) {
		this[c] = _list[c];
	}

	/** Debug log levels */
	this._dLog = debug(config.name + ':log');
	this._dWarn = debug(config.name + ':warn');
	this._dError = debug(config.name + ':error');

	//Enhances error display
	process.on('uncaughtException', cl.error.bind(cl));

	if (callback) callback();
}

/**
 * Prints a log message in the console
 * @method log
 * @param {string} msg The message to print
 */
Console.prototype.log = function(msg) {
	_dLog(this.CYAN + 'Info  : ' + this.WHITE + msg);
};

/**
 * Prints a warning message in the console
 * @method warning
 * @param {string} msg The message to print
 */
Console.prototype.warn = function(msg) {
	_dWarn(this.YELLOW + 'Warn  : ' + this.WHITE + msg);
};

/**
 * Prints an error message in the console
 * @method error
 * @param {string|Error} msg The message or error-stack to print
 */
Console.prototype.error = function(msg) {
	if (msg instanceof Error) {
		var _errInfo = stacktrace.call(this, msg);
		_dError(this.RED + 'Error : ' + this.WHITE + _errInfo);
	}
	else {
		_dError(this.RED + 'Error : ' + this.WHITE + msg);
	}
};

/**
 * Prints a message in the console (still uses log channel)
 * @method print
 * @param {string} msg The message to print
 */
Console.prototype.print = function(msg) {
	_dLog(msg);
};

/* Exports -------------------------------------------------------------------*/

module.exports = Console;
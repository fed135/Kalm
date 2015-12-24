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

/* Local variables -----------------------------------------------------------*/

var sep = '\t:: ';

/* Methods -------------------------------------------------------------------*/

/**
 * Console class
 * @constructor
 * @param {Kalm} K Kalm reference
 * @param {function} callback The callback method
 */
function Console(K, callback) {
	this.p = K;

	var config = this.p.config;
	var name = config.name || config.label;

	for (var c in colors) {
		this[c] = colors[c];
	}

	/** Debug log levels */
	this._dLog = debug(name + ':log');
	this._dLog.log = console.log.bind(console);
	this._dLog.color = '6';
	this._dWarn = debug(name + ':warn');
	this._dWarn.log = console.log.bind(console);
	this._dWarn.color = '3';
	this._dError = debug(name + ':error');
	this._dError.color = '1';

	//Enhances error display
	process.on('uncaughtException', this.error.bind(this));

	if (callback) callback(this);
}

/**
 * Prints a log message in the console
 * @method log
 * @param {string} msg The message to print
 */
Console.prototype.log = function(msg) {
	this._dLog(this.CYAN + sep + this.WHITE + msg);
};

/**
 * Prints a warning message in the console
 * @method warning
 * @param {string} msg The message to print
 */
Console.prototype.warn = function(msg) {
	this._dWarn(this.YELLOW + sep + this.WHITE + msg);
};

/**
 * Prints an error message in the console
 * @method error
 * @param {string|Error} msg The message or error-stack to print
 */
Console.prototype.error = function(msg) {
	if (msg instanceof Error) {
		var _errInfo = stacktrace.call(this, msg);
		this._dError(this.RED + sep + this.WHITE + _errInfo);
	}
	else {
		this._dError(this.RED + sep + this.WHITE + msg);
	}
};

/**
 * Prints a message in the console (still uses log channel)
 * @method print
 * @param {string} msg The message to print
 */
Console.prototype.print = function(msg) {
	this._dLog(msg);
};

/* Exports -------------------------------------------------------------------*/

module.exports = Console;
/**
 * Console methods
 * !! Avoid direct console logs, use these methods instead !!
 * @exports {component(console)}
 */

'use strict'

/* Requires ------------------------------------------------------------------*/

var debug = require('debug');
var colors = require('./colors.package');
var stacktrace = require('./stacktrace.package');

/* Local variables -----------------------------------------------------------*/

/** Need to override debug's output format */
debug.formatArgs = _formatArgs;

/** Debug log levels */
var _dLog = debug('Kalm:log');
var _dWarn = debug('Kalm:warn');
var _dError = debug('Kalm:error');

/* Methods -------------------------------------------------------------------*/

/**
 * Formats debug output for Kalm applications. Overrides arguments.
 * @private
 * @method _formatArgs
 * @param {*}
 * @returns {*}
 */
function _formatArgs() {
	if (this.namespace.indexOf('Kalm') === -1) {
		arguments[0] = '[' + this.namespace + '] ' + arguments[0];
	}
	
	return arguments;
}

/**
 * Prints a log message in the console
 * @method log
 * @param {string} msg The message to print
 */
function log(msg) {
	_dLog(this.CYAN + 'Info  : ' + this.WHITE + msg);
}

/**
 * Prints a warning message in the console
 * @method warning
 * @param {string} msg The message to print
 */
function warn(msg) {
	_dWarn(this.YELLOW + 'Warn  : ' + this.WHITE + msg);
}

/**
 * Prints an error message in the console
 * @method error
 * @param {string|Error} msg The message or error-stack to print
 */
function error(msg) {
	if (msg instanceof Error) {
		var _errInfo = stacktrace(msg);
		_dError(this.RED + 'Error : ' + this.WHITE + _errInfo);
	}
	else {
		_dError(this.RED + 'Error : ' + this.WHITE + msg);
	}
}

/**
 * Prints a message in the console (still uses log channel)
 * @method print
 * @param {string} msg The message to print
 */
function print(msg) {
	_dLog(msg);
}

/**
 * Entry point for console configuration
 * @method main
 */
function main() {
	var _list = colors.getList();
	for (var c in _list) {
		this[c] = _list[c];
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'console',
	attributes: colors.codes,
	methods: {
		print: print,
		log: log,
		warn: warn,
		error: error,
		init: main
	}
};
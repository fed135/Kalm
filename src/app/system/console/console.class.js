/**
 * Console methods
 *
 * !! Avoid direct console logs, use these methods instead !!
 */

/* Requires ------------------------------------------------------------------*/

var debug = require('debug');
var colors = require('./colors.package');
var stacktrace = require('./stacktrace.package');

/* Local variables -----------------------------------------------------------*/

debug.formatArgs = _formatArgs;

var _dLog = debug('Kalm:log');
var _dWarn = debug('Kalm:warn');
var _dError = debug('Kalm:error');

/* Methods -------------------------------------------------------------------*/

function _formatArgs() {
	if (this.namespace.indexOf('Kalm') === -1) {
		arguments[0] = '[' + this.namespace + '] ' + arguments[0];
	}
	
	return arguments;
}

function log(msg) {
	_dLog(this.CYAN + 'Info  : ' + this.WHITE + msg);
}

function warn(msg) {
	_dWarn(this.YELLOW + 'Warn  : ' + this.WHITE + msg);
}

function error(msg) {
	if (msg instanceof Error) {
		var _errInfo = stacktrace(msg);
		_dError(this.RED + 'Error : ' + this.WHITE + _errInfo);
	}
	else {
		_dError(this.RED + 'Error : ' + this.WHITE + msg);
	}
}

function print(msg) {
	_dLog(msg);
}

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
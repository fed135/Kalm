/**
 * Console methods
 *
 * !! Avoid direct console logs, use these methods instead !!
 */

/* Requires ------------------------------------------------------------------*/

var debug = require('debug');
var colors = require('./colors.package');

/* Local variables -----------------------------------------------------------*/

debug.formatArgs = _formatArgs;

var _dLog = debug('Kalm:log');
var _dWarn = debug('Kalm:warn');
var _dError = debug('Kalm:error');

/* Methods -------------------------------------------------------------------*/

function _formatArgs() {
	return arguments;
}

function _log(msg) {
	_dLog(this.CYAN + 'Info  : ' + this.WHITE + msg);
}

function _warn(msg) {
	_dWarn(this.YELLOW + 'Warn  : ' + this.WHITE + msg);
}

function _error(msg) {
	if (msg instanceof Error) {
		var _errInfo = stacktrace.parse(msg);
		_dError(this.RED + 'Error : ' + this.WHITE + _errInfo);
	}
	else {
		_dError(this.RED + 'Error : ' + this.WHITE + msg);
	}
}

function _print(msg) {
	_dLog(msg);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'console',
	attributes: colors,
	methods: {
		print: _print,
		log: _log,
		warn: _warn,
		error: _error
	}
};
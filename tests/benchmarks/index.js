/**
 * Kalm benchmarking
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Kalm = require('./transports/kalm');
const TCP = require('./transports/tcp');
const IPC = require('./transports/ipc');
const UDP = require('./transports/udp');
const settings = require('./settings');

/* Local variables -----------------------------------------------------------*/

const _maxCount = null;
let _curr = 0;
const Suite = { IPC, TCP, UDP };
const tests = [];
const results = {};

/* Methods -------------------------------------------------------------------*/

function _measure(transport, resolve) {
	_curr = 0;
	transport.setup(function _setupHandler() {
		setTimeout(function _stoptransport() {
			transport.stop(function _finish() {
				transport.teardown(resolve);
			});
		}, settings.testDuration);

		function _repeat() {
			if (_maxCount !== null) {
				if (_curr >= _maxCount) return;
				_curr++;
			}
			setImmediate(function _stepHandler() {
				transport.step(_repeat);
			});
		}

		_repeat();
	});
}

function _updateSettings(obj, resolve) {
	settings.transport = obj.transport || settings.transport;
	resolve();
}

function _errorHandler(err) {
	console.log(err);
}

function _postResults() {
	console.log(JSON.stringify(results));
	// Do something with the info
	process.exit();
}

/* Init ----------------------------------------------------------------------*/


// Roll port number
settings.port = 3000 + Math.round(Math.random()*1000);

var adpts = Object.keys(Suite).map(function(k) {
	return {
		transport: k,
		settings: {transport: k},
		raw: Suite[k],
		kalm: Kalm
	};
});

adpts.forEach(function(i) {
	tests.push(function(resolve) {
		console.log('Configuring ' + i.transport);
		_updateSettings(i.settings, resolve);
	});

	tests.push(function(resolve) {
		console.log('Measuring raw ' + i.transport);
		_measure(i.raw, function(total) {
			results['raw_' + i.transport] = total;
			resolve();
		});
	});

	tests.push(function(resolve) {
		console.log('Measuring Kalm ' + i.transport);
		_measure(i.kalm, function(total) {
			results['kalm_' + i.transport] = total;
			resolve();
		});
	});
});

tests.push(_postResults);

tests.reduce(function(current, next) {
	return current.then(function(resolve) {
		return new Promise(next).then(resolve, _errorHandler);
	}, _errorHandler);
}, Promise.resolve());
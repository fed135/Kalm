/**
 * Kalm benchmarking
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Kalm = require('./adapters/kalm');
var TCP = require('./adapters/tcp');
var IPC = require('./adapters/ipc');
var UDP = require('./adapters/udp');

var settings = require('./settings');

/* Local variables -----------------------------------------------------------*/

var _maxCount = null;
var _curr = 0;

var Suite = {
	ipc: IPC,
	tcp: TCP,
	udp: UDP
};

var tests = [];
var adpts;
var results = {};

/* Methods -------------------------------------------------------------------*/

function _measure(adapter, resolve) {
	_curr = 0;
	adapter.setup(function _setupHandler() {
		setTimeout(function _stopAdapter() {
			adapter.stop(function _finish() {
				adapter.teardown(resolve);
			});
		}, settings.testDuration);

		function _repeat() {
			if (_maxCount !== null) {
				if (_curr >= _maxCount) return;
				_curr++;
			}
			setImmediate(function _stepHandler() {
				adapter.step(_repeat);
			});
		}

		_repeat();
	});
}

function _updateSettings(obj, resolve) {
	settings.adapter = obj.adapter || settings.adapter;
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
		adapter: k,
		settings: {adapter: k},
		raw: Suite[k],
		kalm: Kalm
	};
});

adpts.forEach(function(i) {
	tests.push(function(resolve) {
		console.log('Configuring ' + i.adapter);
		_updateSettings(i.settings, resolve);
	});

	tests.push(function(resolve) {
		console.log('Measuring raw ' + i.adapter);
		_measure(i.raw, function(total) {
			results['raw_' + i.adapter] = total;
			resolve();
		});
	});

	tests.push(function(resolve) {
		console.log('Measuring Kalm ' + i.adapter);
		_measure(i.kalm, function(total) {
			results['kalm_' + i.adapter] = total;
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
// TODO: Cleanup!

var Kalm = require('./kalm.test');
//var Raw = require('./raw.test');
//var Raw = require('./raw-ipc.test');
var Raw = require('./raw-udp.test');
//var Raw = require('./raw-ws.test');

var settings = require('./settings');

var maxCount = null;
var curr = 0;

function _kalm(resolve) {
	curr = 0;
	Kalm.setup(function() {
		setTimeout(function() {
			Kalm.teardown(function(total) {
				console.log('kalm: ' + total);
				resolve();
			});
		}, settings.testDuration);

		function _repeat() {
			if (maxCount !== null) {
				if (curr >= maxCount) return;
				curr++;
			}
			setImmediate(function() {
				Kalm.step(_repeat);
			});
		}

		_repeat();
	});
}

function _raw(resolve) {
	curr = 0;
	Raw.setup(function() {
		setTimeout(function() {
			Raw.teardown(function(total) {
				console.log('raw: ' + total);
				resolve();
			});
		}, settings.testDuration);

		function _repeat() {
			if (maxCount !== null) {
				if (curr >= maxCount) return;
				curr++;
			}

			setImmediate(function() {
				Raw.step(_repeat);
			});
		}

		_repeat();
	});
}

_kalm(function() {
	_raw(process.exit);
})
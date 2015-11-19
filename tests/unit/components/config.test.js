var assert = require('chai').assert;

describe('config', function() {

	it('check values', function() {
		var config = K.getComponent('config');

		assert.strictEqual(config.mock, true);
		assert.strictEqual(config.debug.noColor, true);
		assert.strictEqual(config.connections.ipc.path, '/tmp/test-');
		assert.strictEqual(config.connections.ipc.port, 94000);
		assert.strictEqual(config.connections.tcp.port, 9500);
		assert.strictEqual(config.connections.udp.port, 9600);
	});

	it('check created service', function() {
		var circles = K.getComponent('circles');
		var testService = circles.find('global').service('unit.test');
		
		assert.strictEqual(testService.port, 95000);
		assert.strictEqual(testService.label, 'unit.test');
		assert.strictEqual(testService.adapter, 'ipc');
		assert.strictEqual(testService.poolSize, -1);
	});
});
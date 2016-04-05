function process(client, emit, channel, payload) {
	var options = client.options.transform.bundler || {};

	if (!client.__bundler) {
		client.__bundler = {
			timers: {}
		};
	}

	if (client.packets[channel].length > options.maxPackets || 0) {
		if (client.__bundler.timers[channel]) {
			clearTimeout(client.__bundler.timers[channel]);
		}
		emit(channel);
		return;
	}

	if (!client.__bundler.timers[channel]) {
		client.__bundler.timers[channel] = setTimeout(
			function _emitBundle() {
				emit(channel);
			}, 
			options.delay || 1000/60
		);
	}
}
	// Bundling logic
	// -----------------------------
	// Add new calls to the bundle stack
	// If stack length exceeds limit OR
	// If time since last chunk sent is greater than the delay -
	// AND there is an item in the stack
	// Send.
	// If an item is added and delay timer is not started, start it. 

module.exports = {
	process: process
};
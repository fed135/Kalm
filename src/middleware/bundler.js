function process() {
	if (this.bundles.length > this.peer.options.maxBundle) {
		this._bundleTimer = setTimeout(this._tick.bind(this), this.peer.options.bundleDelay);
	}
	else {
		this._bundleTimer = null;
	}

	this.adapter.prototype.send.call(this, encoders[this.peer.options.encoder].encode(this.bundles.splice(0, this.peer.options.maxBundle)));
	this.onComplete.dispatch();
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
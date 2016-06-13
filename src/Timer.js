/**
 * Timer class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;

/* Methods -------------------------------------------------------------------*/

class Timer extends EventEmitter {

	/**
	 * Timer constructor
	 * @param {integer} delay The tick interval
	 */
	constructor(delay) {
		super();

		this.delay = delay;
		this.timer = null;

		this.start();
	}

	/**
	 * Starts the timer
	 * @returns {Timer} Returns itself for chaining
	 */
	start() {
		if (this.timer) this.stop();
		this.timer = setInterval(e => this.emit('step'), this.delay);
		return this;
	}

	/**
	 * Stops the timer
	 * @returns {Timer} Returns itself for chaining
	 */
	stop() {
		clearInterval(this.timer);
		this.timer = null;
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = Timer;
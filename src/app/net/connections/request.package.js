/**
 * Generic request class.
 */ 

/* Requires ------------------------------------------------------------------*/

var Signal = require('signals');

/* Local variables -----------------------------------------------------------*/

/* Class ---------------------------------------------------------------------*/

/**
 * Request class
 * Used as a prototype for all outgoing requests.
 * @class Request
 * @constructor
 */
function Request() {
	this.hostname = '0.0.0.0';
	this.port = null;
	this.method = 'GET';
	this.path = '/';
	this.params = {};
	this.payload = null;
	this.connector = null;
	this.headers = {};
	this.authKey = null;
	this.id;
	this.status = 0;

	this.__events = {};
}

/**
 * Default behavior for sending a request
 * @memberof Request
 * @method send
 * @param {function} callback The method to call after the request
 */
Request.prototype.send = function(callback) {
	var cl = K.getComponent('console');
	cl.warn('No method defined for sending request');
	cl.warn(this);
	if (callback) callback();
};

/**
 * Default behavior when listnening for events
 * @memberof Request
 * @method on
 * @param {string} eventName The name of the event to listen for
 * @param {function} callback The method to call
 */
Request.prototype.on = function(eventName, method) {
	if (!this.__events[eventName]) this.__events[eventName] = new Signal();
	this.__events[eventName].add(method);
};

/**
 * Default behavior for handling events
 * @memberof Request
 * @method __handleEvent
 * @private
 * @param {string} eventName The name of the event to listen for
 * @param {*} data Optionnal data to pass to the methods
 */
Request.prototype.__handleEvent = function(eventName, data) {
	if (this.__events[eventName]) this.__events[eventName].dispatch(data);
};

/* Methods -------------------------------------------------------------------*/

/**
 * Creates the request object
 * @method create
 * @param {object} options The settings for the request
 */
function create(options) {
	var utils = K.getComponent('utils');
	return utils.object.mixin(Object.create(Request), options);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	create: create
};
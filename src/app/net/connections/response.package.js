/**
 * Generic response class.
 */ 

/* Requires ------------------------------------------------------------------*/

var Signal = require('signals');

/* Local variables -----------------------------------------------------------*/

/* Classes -------------------------------------------------------------------*/

/**
 * Response class
 * Used as a prototype for all incomming response.
 * @class Response
 * @constructor
 */
function Response() {
	this.origin = null;
	this.method = 'GET';
	this.path = '/';
	this.params = {};
	this.payload = null;
	this.connector = null;
	this.headers = null;
	this.authKey = null;
	this.id = null;
	this.status = 0;

	this.__events = {};
}

/**
 * Default behavior for replying to a request
 * @memberof Response
 * @method reply
 * @param {function} callback The method to call after the request
 */
Response.prototype.reply = function(callback) {
	var cl = K.getComponent('console');
	cl.warn('No method defined for replying to request');
	cl.warn(this);
	if (callback) callback();
};

/**
 * Default behavior when listnening for events
 * @memberof Response
 * @method on
 * @param {string} eventName The name of the event to listen for
 * @param {function} callback The method to call
 */
Response.prototype.on = function(eventName, method) {
	if (!this.__events[eventName]) this.__events[eventName] = new Signal();
	this.__events[eventName].add(method);
};

/**
 * Default behavior for handling events
 * @memberof Response
 * @method __handleEvent
 * @private
 * @param {string} eventName The name of the event to listen for
 * @param {*} data Optionnal data to pass to the methods
 */
Response.prototype.__handleEvent = function(eventName, data) {
	if (this.__events[eventName]) this.__events[eventName].dispatch(data);
};

/* Methods -------------------------------------------------------------------*/

/**
 * Creates the response object
 * @method create
 * @param {object} options The values for the response
 */
function create(options) {
	var utils = K.getComponent('utils');
	return utils.object.mixin(Object.create(Response), options);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	create: create
};
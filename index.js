/**
 * Kalm micro-service creation entry point
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Kalm = require('./src/Kalm');
var pkg = require('./package');

/* Methods -------------------------------------------------------------------*/

/**
 * Creates a Kalm micro-service instance
 * @method create
 * @param {object} config The configuration object for the service
 * @param {array|null} controllers The list of controller collections to use
 * @param {function|null} callback The callback method on service ready
 * @returns {Kalm} The created Kalm instance
 */
function create(config, controllers, callback){
	var K = new Kalm(pkg, config);

	if (controllers) {
		K.onReady.add(function bindControllers(){
			K.getComponent('services').bindHandlers(controllers);
		});
	}

	if (callback) K.onReady.add(callback);

	return K;
};

/* Exports -------------------------------------------------------------------*/

module.exports = {
	create: create
};
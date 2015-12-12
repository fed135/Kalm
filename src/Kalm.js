/**
 * Kalm App instance
 * @exports {Kalm}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var path = require('path');
var Signal = require('signals');

/* Methods -------------------------------------------------------------------*/

/**
 * Kalm framework constructor
 * @constructor
 * @param {object} pkg The package file for the Kalm distribution
 * @param {object} config The app config of the Kalm project
 */
function Kalm(pkg, config) {
	var _self = this;

	this.pkg = pkg;
	this.appConf = config;
	this.config = {
		environment: 'dev',
		mock: false,
		debug: { noColor: false },
		adapters: {
			ipc: {
				port: 4001,
				evt: 'message',
				path: '/tmp/socket-'
			}
		}
	};
	this.components = {};

	this.onReady = new Signal();
	this.onShutdown = new Signal();

	process.on('SIGINT', this.terminate.bind(this));
	process.on('SIGTERM', this.terminate.bind(this));

	this._loadComponents(this.registerComponent, this.onReady.dispatch);
}

/**
 * Loads the listed components
 * @private
 * @method _loadComponents
 * @memberof Kalm
 * @param {function} method The method to call on every matching file
 * @param {function} callback The callback method
 */
Kalm.prototype._loadComponents = function(method, callback) {
	
	var classMarker = '.class';

	//In load order
	var components = {
		utils: 'utils/utils',
    system: 'system/system',
    console: 'system/console/console',
    net: 'net/net',
		peers: 'net/peers/peers'
	};


	Promise.all(Object.keys(components).map(function(e) {
		return method(e, require('./app/'+components[e]+classMarker));
	}), callback);
};

/**
 * Registers a component with the Kalm instance
 * @method registerComponent
 * @memberof Kalm
 * @param {string} pkgName The name of the component to register
 * @param {function} pkg The constructor for the component
 * @returns {Promise} Deferred promise for component registration
 */
Kalm.prototype.registerComponent = function(pkgName, pkg) {
	var _self = this;
	return new Promise(function(resolve) {
		_self.components[pkgName] = new pkg(_self, resolve);
	});
};

/**
 * Handles app termination
 * @method terminate
 * @memberof {Kalm}
 * @param {function} callback The callback method
 */
Kalm.prototype.terminate = function() {
	var connection = this.getComponent('connection');
	var cl = this.getComponent('console');
	var utils = this.getComponent('utils');

	cl.print('\r  ');
	cl.warn('Shutting down...');

	this.__offSwitch.dispatch();

	utils.async.all(
		Object.keys(connection.adapters).map(function(e){
			return connection.adapters[e].stop;
		}),
		_kill
	);

	//Just in case something goes bad
	setTimeout(function _kill() {
		process.exit();
	}, 1500);
};

/* Exports -------------------------------------------------------------------*/

module.exports = Kalm;
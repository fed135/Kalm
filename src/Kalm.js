/**
 * Kalm App instance
 * @exports {Kalm}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var path = require('path');
var Signal = require('signals');
var deepMixin = require('mixin-deep');

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
	this.config = deepMixin({
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
	}, config);
	this.components = {};

	this.onReady = new Signal();
	this.onShutdown = new Signal();

	process.on('SIGINT', this.terminate.bind(this));
	process.on('SIGTERM', this.terminate.bind(this));

	this._loadComponents(this.registerComponent.bind(this), function() {
		process.nextTick(_self.onReady.dispatch);
	});
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
	var _self = this;
	//In load order
	var components = {
		utils: 'utils/utils',
    system: 'system/system',
    console: 'system/console/console',
    net: 'net/net',
		peers: 'net/peers/peers'
	};

	var tasks = Object.keys(components).map(function(c) {
		var component = new Promise(function(resolve) {
			method(c, require('./app/'+components[c]+classMarker), resolve);
		});
		component.catch(function(e) {
			console.log(e.stack);
			_self.terminate.call(_self);
		});
		return component;
	}).reduce(function(current, next) {
			return current.then(next);
	}, Promise.resolve()).then(callback);
};

/**
 * Registers a component with the Kalm instance
 * @method registerComponent
 * @memberof Kalm
 * @param {string} pkgName The name of the component to register
 * @param {function} pkg The constructor for the component
 * @returns {Promise} Deferred promise for component registration
 */
Kalm.prototype.registerComponent = function(pkgName, pkg, callback) {
	this.components[pkgName] = new pkg(this, callback);
};

/**
 * Handles app termination
 * @method terminate
 * @memberof {Kalm}
 * @param {function} callback The callback method
 */
Kalm.prototype.terminate = function() {
	var net = this.components.net;
	var cl = this.components.console;
	var utils = this.components.utils;

	cl.warn('Shutting down...');

	this.onShutdown.dispatch();

	if (net && net.adapters) {
		utils.async.all(
			Object.keys(net.adapters).map(function(e){
				return net.adapters[e].stop.bind(net.adapters[e]);
			}),
			process.exit
		);
	}
	else process.exit();
};

/* Exports -------------------------------------------------------------------*/

module.exports = Kalm;
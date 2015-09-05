/**
 * The list of routes for the application 
 */

/* Requires ------------------------------------------------------------------*/

var defaultRoutes = require('./default');

/* Methods -------------------------------------------------------------------*/

function load(callback) {
	var _self = this;
	var routing = K.getComponent('routing');
	
	var _confRoutes = K.appConf.routes || [];
	var _confControllers = K.appConf.controllers || {};

	_confRoutes.forEach(function(e) {
		e.handler	= _confControllers[e.handler] || _defaultHandler;
	});

	//TODO:check for duplicates
	this.list.forEach(function(e, i, arr) {
		arr[i] = routing.parse(e);
	});

	if (callback) callback();
}

function has(connector) {
	if (this.list.length === 0) return false;
	
	return this.list.every(function(e) {
		return (e.connector.indexOf(connector) !== -1);
	});
}

function print() {
	return this.list;
}

function _defaultHandler(socket, reply) {
	var config = K.getComponent
	reply(config.routing.defaultResponse, config.routing.defaultStatus)
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'routes',
	attributes: {
		schema: {
			action: [],	//http, ipc, zmq, etc.
			path: '',	//Covers socket name
			handler: _defaultHandler,
			meta: {
				description: '',
				tags: []
			}
		},
		list: defaultRoutes	//Add your custom routes here
	},
	methods: {
		init: load,
		has: has,
		print: print
	}
};
/**
 * Circles packages
 * @exports {component(circles)}
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

var Circle = require('./circle.package');

/* Local variables -----------------------------------------------------------*/

/** The stored list of circles */
var _list = {};

/* Methods -------------------------------------------------------------------*/

/**
 * Creates a new circle
 * @method create
 * @param {string|null} name The name for the circle
 * @param {object|null} options The parameters for the circle
 * @returns {Circle} The newly created circle
 */
function create(name, options) {
	var utils = K.getComponent('utils');
	var c;

	options = options || Object.create(null);
	options.label = name || utils.crypto.uid();
	
	//Prevent accidental override
	if (_list[options.label]) return _list[options.label];

	c = new Circle(options);
	_list[c.label] = c;
	return c;
}

/**
 * Finds a previously created circle, or attempts to make it
 * @method find
 * @param {string|null} name The name for the circle
 * @param {object|null} options The parameters for the circle
 * @returns {Circle} The requested circle
 */
function find(name, options) {
	if (name in _list) return _list[name];

	this.create(name, options);
	return find(name);
}

/**
 * Entry point for circles class. Instantiates the global circle.
 * @method main
 * @param {function} callback The callback method
 */
function main(callback) {
	create('global');
	callback();
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'circles',
	attributes: {
		list: {}
	},
	methods: {
		_init: main,
		find: find,
		create: create
	}
};
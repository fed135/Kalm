/**
 * Circles packages
 * @exports {package(circles)}
 */

'use strict'

/* Requires ------------------------------------------------------------------*/

var Circle = require('./circle.package');

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
	c = new Circle(options);
	this.list[c.label] = c;
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
	if (name in this.list) return this.list[name];

	if (!options) return null;

	this.create(name, options);
	return find(name);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'circles',
	attributes: {
		list: {}
	},
	methods: {
		find: find,
		create: create
	}
};
/**
 * A utility method to get the file and line number from an error stack
 * @exports {function} prettyPrintStack
 */

'use strict'

/* Requires ------------------------------------------------------------------*/

var colors = require('./colors.package');

/* Methods -------------------------------------------------------------------*/

/**
 * Creates a readable format for an error stack
 * @method prettyPrintStack
 * @param {Error} error The error to print
 * @returns {string} The stringified, pretty stack
 */
function prettyPrintStack(error) {
	var ret;
	var stack;
	var cwd = process.cwd();
	var cList = colors.getList();

	stack = (error.stack.split('\n')).splice(0,4);
	ret = stack[0].substring(stack[0].indexOf(': ') + 2) + '\n';

	stack.shift();

	stack.forEach(function(e, i){
		//trim project base or add -node
		if (e.indexOf(cwd) !== -1) {
			e = e.replace(cwd, '.');
		}

		ret += (cList.RED + '\t-');
		for (var dashes = 0; dashes < i; dashes++) ret += '-';
		ret += ('> ' + cList.WHITE);
		ret += (e.substring(e.indexOf('at ') + 3) + '\n');
	});

	//ret += (colors.RED + '\t ...');

	return ret;
}

/* Exports -------------------------------------------------------------------*/

module.exports = prettyPrintStack;

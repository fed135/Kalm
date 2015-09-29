/**
 * Connection class
 * This is the regroupement of all the i/o adapters.
 */

/* Requires ------------------------------------------------------------------*/

/* Local variables -----------------------------------------------------------*/

/* Methods -------------------------------------------------------------------*/

/**
 *
 */
function loadAdapter(adapter, path, callback) {
	var routes = K.getComponent('routes');

	this.adapters[adapter.name] = adapter;
	if (adapter.autoload || routes.has(adapter.name)) {
		adapter.listen(callback);
	}
	else callback();
}

function main(callback) {
	var utils = K.getComponent('utils');

	utils.loader.load('./', '.adapter.js', _loadAdapter.bind(this), callback);
}

function send(type, options, callback) {
	if (!type in this.adapters) return callback('Unknown type "' + type + '"');

	this.adapters[type].send(options, callback);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	pkgName: 'connection',
	attributes: {
		adapters: []
	},
	methods: {
		_init: main,
		load: load,
		send: send
	}
};
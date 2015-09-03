/**
 * The list of codes for colors in the console
 */

/* Local variables -----------------------------------------------------------*/

var COLORS = {
	GREY: '\x1b[90m',
	RED: '\x1b[91m',
	GREEN: '\x1b[92m',
	YELLOW: '\x1b[93m',
	BLUE: '\x1b[94m',
	MAGENTA: '\x1b[95m',
	CYAN: '\x1b[96m',
	WHITE: '\x1b[97m'
};

/* Methods -------------------------------------------------------------------*/

function getList() {
	var config = K.getComponent('config');

	if (config.debug && config.debug.noColor) {
		return {
			GREY: '', RED: '', GREEN: '', YELLOW: '', BLUE: '', MAGENTA: '', CYAN: '',
			WHITE: ''
		};
	}

	return COLORS;
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	codes: COLORS,
	getList: getList
};
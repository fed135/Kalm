'use strict';

/* Local variables -----------------------------------------------------------*/

// In-memory sessions
const sessions = {};

/* Methods -------------------------------------------------------------------*/

function resolve(id) {
	if (!sessions.hasOwnProperty(id)) {
		sessions[id] = { data: {} }
	}
	sessions[id].lastUpdated = Date.now();
	return sessions[id].data;
}

function cleanup(id) {
	delete sessions[id];
}

/* Exports -------------------------------------------------------------------*/

module.exports = { resolve, cleanup };
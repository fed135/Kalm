'use strict';

/* Local variables -----------------------------------------------------------*/

// In-memory sessions
const sessions = {};

/* Methods -------------------------------------------------------------------*/

function resolve(id) {
	if (!session.hasOwnProperty(id)) {
		session[id] = { data: {} }
	}
	session[id].lastUpdated = Date.now();
	return session[id].data;
}

function cleanup(id) {
	delete sessions[id];
}

/* Exports -------------------------------------------------------------------*/

module.exports = { resolve, cleanup };
/**
 * Generic response class.
 */ 

/* Requires ------------------------------------------------------------------*/

/* Local variables -----------------------------------------------------------*/

/* Methods -------------------------------------------------------------------*/

function Response() {
	origin,
	method,
	(path/event),
	params,
	payload,
	connector,
	headers,
	authKey,
	id,
	status
}

Response.prototype.reply = function (){
	
};

Response.prototype.on = function () {
	
};

function create(options) {
	var utils = K.getComponent('utils');
	return utils.object.mixin(Object.create(Response), options);
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	create: create
};
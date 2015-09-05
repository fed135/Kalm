Request.servedUid = 0;

function Request(req) {
	var utils = K.getComponent('utils');
	utils.object.mixin(this, req);

	this.uid = req.uid || Request.servedUid++;
}

module.exports = Request;
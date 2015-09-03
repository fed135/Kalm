Request.servedUid = 0;

function Request(req, reply, type) {
	this.uid = req.uid || Request.servedUid++;
	this.reply = reply;
	this.type = type;
}
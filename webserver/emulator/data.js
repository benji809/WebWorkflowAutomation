sessions = new Map();

class session{
	constructor(userid,browser,page,screenshot,messagetosend,timeout){
	this.userid = userid;
	this.browser = browser;
	this.page = page;
	this.screenshot = screenshot;
	this.messagetosend = messagetosend;
	this.timeout = timeout; 
	}

}

const del = "vpm5985apop";


module.exports = {sessions,session,del}

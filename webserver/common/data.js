sessions = new Map();
offers = new Map();
screenshots = new Map();

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

class offer{
	constructor(id,name,nbmaxworkflow,workflowautomatedallowed,price,sendemail,everymin,imagequality_value,imagequality_text,timeout,attributeallowed,screenshotallowed,hotline){
		this.id = id;
		this.name = name;
		this.nbmaxworkflow = nbmaxworkflow;
		this.workflowautomatedallowed = workflowautomatedallowed;
		this.price = price;
		this.sendemail = sendemail;
		this.everymin = everymin;
		this.imagequality_value = imagequality_value;
		this.imagequality_text = imagequality_text;
		this.timeout = timeout;
		this.attributeallowed = attributeallowed;
		this.screenshotallowed = screenshotallowed;
		this.hotline = hotline;

	}



}
const del = "vpm5985apop";


module.exports = {sessions,session,del,offer,offers}

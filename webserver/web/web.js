var {getfilecontent} = require('./tpl.js');
var {getfile} = require('./tpl.js');
var {dologin,doregister,activate,dorecover,changepassword} = require('./webservicesNOTauthed.js');
var {docreatewf,dologout,deletewf,togglewf} = require('./webservicesauthed');
var {islogguedin} = require('../common/utils.js');
const {getwf} = require('./mywf.js');
const { showoffers } = require('../common/subscriptions.js');
var captchapng = require('captchapng');

exports.dispatch = async function (req,res)
{
var [data,contenttype] = await getcontent(req,res);
res.writeHead(200,{'Content-Type':contenttype });
res.write(data);
res.end();
}


async function getcontent (req,res)
{



// FILES

if(req.query.action == "getfile") {return getfile(req.query.file);}

// WEB SERVICES NOT AUTHED

if(req.query.action == "dologin") 		 return [await dologin(req),"text/plain"];
if(req.query.action == "doregister") 	 return [await doregister(req),"text/plain"];
if(req.query.action == "activate") 		 return [await activate(req),"text/plain"];
if(req.query.action == "dorecover") 	 return [await dorecover(req),"text/plain"];
if(req.query.action == "changepassword") return [await changepassword(req),"text/plain"];

// WEB SERVICES AUTHED

if(islogguedin(req))
{
	if(req.query.action == "docreatewf") 		return [await docreatewf(req),"text/plain"];
	if(req.query.action == "deletewf") 			return [await deletewf(req),"text/plain"];
	if(req.query.action == "togglewf") 			return [await togglewf(req),"text/plain"];
	if(req.query.action == "logout") 			return [dologout(req),"text/plain"];
}


// IF NOT AUTHED, CAN NOT CREATE WF
if(req.query.action == "docreatewf" && !islogguedin(req)) return ["NC","text/plain"];
		

// STUDIO
if(req.query.action == "studio")  return [getfilecontent("studio"),"text/html"];


//IHM

var out = getfilecontent("header");



// NO NEED TO BE AUTHED
if(req.query.action == "login") 	out += getfilecontent("login");
if(req.query.action == "register") 	out += getfilecontent("register");
if(req.query.action == "recover1") 	out += getfilecontent("recover1");
if(req.query.action == "recover2") 	out += getfilecontent("recover2").replace("#value",req.query.key);
if(req.query.action == "create") 	
{	// generate captcha here
	var number = parseInt(Math.random()*900000+100000);
	req.session.captcha = number;
	var p = new captchapng(190,50,number); // width,height,numeric captcha
    p.color(50, 50, 80, 50);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
 
    var img = p.getBase64();
	out += getfilecontent("create").replace("#CAPTCHAKEY",'data:image/png;base64,' + img);
}
if(req.query.action == "pricing") 	out += showoffers(req);

// HERE NEED TO BE AUTHED

	if(req.query.action == "getwf") 
		{
		if(islogguedin(req)) out += await getwf(req);
		else out+= getfilecontent("login");
		}
	

	
out += getfilecontent("footer");

return [out,"text/html"];

}
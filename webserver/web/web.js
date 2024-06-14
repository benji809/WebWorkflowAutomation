var {getfilecontent} = require('./tpl.js');
var {getfile} = require('./tpl.js');
var {dologin,doregister} = require('./webservices.js');


exports.dispatch = async function (req,res)
{
var [data,contenttype] = await getcontent(req,res);
res.writeHead(200,{'Content-Type':contenttype });
res.write(data);
//console.log(data);
res.end();
}


async function getcontent (req,res)
{



// FILES

if(req.query.action == "getfile") {return getfile(req.query.file);}

// WEB SERVICES

if(req.query.action == "docreate") {return docreatewf();}
if(req.query.action == "createrun") {return createrun();}
if(req.query.action == "dologin") return [await dologin(req),"text/plain"];
if(req.query.action == "doregister") return [await doregister(req),"text/plain"];
if(req.query.action == "activate") {return activate();}
if(req.query.action == "dorecover") {return dorecover();} // send email
if(req.query.action == "changepassword") {return changepassword();} // send email
if(req.query.action == "deletewf") {return deletewf();}
if(req.query.action == "togglewf") {return togglewf();}
if(req.query.action == "logout") {return dologout();}

//create
if(req.query.action == "studio") return [getfilecontent("studio"),"text/html"];

//IHM

var out = getfilecontent("header");



		// HERE NO NEED TO BE AUTHED
if(req.query.action == "login") out += getfilecontent("login");
if(req.query.action == "register") out += getfilecontent("register");
if(req.query.action == "recover1") out += getfilecontent("recover1");
if(req.query.action == "recover2") out +=  getfilecontent("recover2").replace("#value",req.query.key);
if(req.query.action == "create") out += getfilecontent("create");


		// HERE NEED TO BE AUTHED

if(req.query.action == "getwf") {getwf();return;}
if(req.query.action == "pricing") showpricing();
if(req.query.action == "lr") showlr();
if(req.query.action == "success") rs();
if(req.query.action == "qa") qa();


out += getfilecontent("footer");

return [out,"text/html"];

}
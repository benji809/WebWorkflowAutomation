const {createsession} = require('./create.js');
const {getvideo,scroll,move,keyboard,mousedown,mouseup,screenshot,sif} = require('./others.js');
const {sessions} = require('../common/data.js');
const {killsession} = require('./utils.js');
var {getcurrentoffer} = require('../common/subscriptions.js');

exports.dispatch = async function (req,res)
{
if(req.query.action == "createsession") createsession(req,res);
else{

	if(req.query.id == "") return;
	var s = sessions.get(req.session.id);
	if(s == undefined) return;

	if(req.query.action == "getvideo")  getvideo(s,res,req);
	else
	{


				
		res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin':'*'
       		 });



		if(req.query.action == "scroll") scroll(s,req.query.dy*1920);
		if(req.query.action == "move") move(s,req.query.x*1920,req.query.y*1080);
		if(req.query.action == "keyboard") keyboard(s,req.query.key);
		if(req.query.action == "mousedown") mousedown(s);
		if(req.query.action == "mouseup") mouseup(s);
		if(req.query.action == "screenshot") screenshot(s,req.query.x*1920,req.query.y*1080,req.query.w*1920,req.query.h*1080,req);
		if(req.query.action == "kill") killsession(req.query.id);
		if(req.query.action == "sif") sif(req,res);
		
		
		// update the timer
		
		    
   clearTimeout(s.timeout);
   s.timeout = setTimeout(killsession, getcurrentoffer(req).timeout*1000,req.query.id);



		res.end();  
	}
   }
}


const {createsession} = require('./create.js');
const {getvideo,scroll,move,keyboard,mousedown,mouseup} = require('./others.js');
const {sessions} = require('./data.js');

exports.dispatch = function (req,res)
{
if(req.query.action == "createsession") createsession(req,res);
else{

	if(req.query.id == "") return;
	var s = sessions.get(req.query.id);
	if(s == undefined) return;

	if(req.query.action == "getvideo") 
	{
	if(s.screenshot != "") return; // already a stream!
	getvideo(s,res);
	
	
	}
	else
	{
		if(req.query.action == "scroll") scroll(s,req.query.dy*1920);
		if(req.query.action == "move") move(s,req.query.x*1920,req.query.y*1080);
		if(req.query.action == "keyboard") keyboard(s,req.query.key);
		if(req.query.action == "mousedown") mousedown(s);
		if(req.query.action == "mouseup") mouseup(s);
		if(req.query.action == "screenshot") screenshot(s,req.query.x,req.query.y,req.query.w,req.query.h);
		
		
		// update the timer
		
		    
   clearTimeout(s.timeout);
   s.timeout = setTimeout(() => {
  console.log("Session autokilled : " + req.query.id);
  sessions.delete(s);
	}, "60000");
		
		res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin':'*'
       		 });
		res.end();  
	}
   }
}

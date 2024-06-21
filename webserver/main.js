var express = require('express');
var app = express();
var emulator = require('./emulator/emulator.js');
var web = require('./web/web.js');
const sessions = require('express-session');
var {fetchoffers} = require('./common/subscriptions.js')


const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
secret: "wwasecretkey",
saveUninitialized:false,
resave : false,
cookie: { maxAge: oneDay }
}));

fetchoffers();

app.listen(8000);

app.get('/*', function (req, res) 
{ 
	console.log("New request : " + JSON.stringify(req.query));

	if(req.query.dest == "web")
	{
	  // dispatch to web
	  web.dispatch(req,res);
	  return;
	
	}
	
	if(req.query.dest == "emulator")
	{
	  // dispatch to emulator
	  emulator.dispatch(req,res);
	  return;
	  
	}

	res.end();
	
});

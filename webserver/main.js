var express = require('express');
var app = express();
var emulator = require('./emulator/emulator.js');
var web = require('./web/web.js');
const sessions = require('express-session');


const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
secret: "wwasecretkey",
saveUninitialized:true,
cookie: { maxAge: oneDay },
resave: false
}));

app.listen(8000);


app.get('/*', function (req, res) 
{ 

	console.log("New request : " + JSON.stringify(req.query));
	if(req.query.dest == "web")
	{
	  // dispatch to web
	  web.dispatch(req,res);
	
	}
	
	if(req.query.dest == "emulator")
	{
	  // dispatch to emulator
	  emulator.dispatch(req,res);
	  
	}
});

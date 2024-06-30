var express = require('express');
var app = express();
var emulator = require('./emulator/emulator.js');
var web = require('./web/web.js');
const sessions = require('express-session');
var {validation} = require('./common/validations.js')
var {init}  = require ('/home/benji/Documents/WebWorkflowAutomation/orm.js')

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
secret: "wwasecretkey",
saveUninitialized:false,
resave : false,
cookie: { maxAge: oneDay }
}));

start();

async function start()
{
	await init();

	app.listen(8000);

	app.get('/*', function (req, res) 
	{ 

			if(!validation(req.query)) {console.log("not validated");res.end();return;}
			console.log("New valid request : " + JSON.stringify(req.query));

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
			return;s
			
			}

			res.end();
	
	});

}


const {sessions} = require('./data.js');


exports.killsession = async function (s)
{
    try{
	console.log("killing sessions " + s);
    sessions.get(s).browser.close();
    sessions.delete(s);
    }
    catch(e)
    {

   console.log(e);
        
    }
}

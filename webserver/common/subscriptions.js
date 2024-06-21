var {offers,offer} = require ('./data');
var {query} = require('../common/sql.js');
var {islogguedin} = require('./utils.js');

exports.fetchoffers = async function()
{
    var result = await query("SELECT * FROM offers");
    for(var i=0;i<result.length;i++)
        {
            var o = new offer();
            o.id = parseInt(result[i][0]);
            o.name = result[i][1];
            o.nbmaxworkflow = parseInt(result[i][2]);
            o.workflowautomatedallowed = parseInt(result[i][3]);
            o.price = parseFloat(result[i][4]);
            o.sendemail = parseInt(result[i][5]);
            o.everymin = parseInt(result[i][6]);
            o.imagequality_value = parseInt(result[i][7]);
            o.imagequality_text = result[i][8];
            o.timeout = parseInt(result[i][9]);
            o.attributeallowed = parseInt(result[i][10]);
            o.screenshotallowed = parseInt(result[i][11]);
            o.hotline = result[i][12];


            offers.set(o.id,o);
        } 
}

exports.getcurrentoffer = function(req)
{
    if(islogguedin(req)) return offers.get(req.session.offerid);
    else return offers.get(0);
}

exports.userhasreachedmaxwf = async function (req)
{
    var nbcurrentwf = await query("SELECT COUNT(*) FROM workflows WHERE userid = '" + req.session.userid + "'");
    if(nbcurrentwf.length == 0) nbcurrentwf = 0;
    else nbcurrentwf = parseInt(nbcurrentwf[0][0]);
    var nbauthorised = (await exports.getcurrentoffer(req)).nbmaxworkflow;
    if(nbcurrentwf >= nbauthorised) return true;
    return false;
}
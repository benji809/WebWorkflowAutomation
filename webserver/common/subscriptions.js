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



function displayprice(p)
{
if(p == 0) return "FREE";
else return p + "€/month";
}

function displayboolean(b)
{
   if(b == 0) return "&#10060;";
  else return "&#9989;";


}

exports.showoffers = function(req)
{

    var usero = (exports.getcurrentoffer(req)).id;
    console.log(currentoffer);

    var output = '<div style=" display: flex;">';
    
    output += "<div style='width:900px'>";
    output += "<p>&nbsp;</p>";
    output += "<p>NB Max workflow</p>";
    output += "<p>Automatic launch</p>";
    output += "<p>Report emailing</p>";
    output += "<p>Video Quality</p>";
    output += "<p>Attribute testing</p>";
    output += "<p>Screenshot testing</p>";
    output += "<p>Support in</p>";

    output +=  '</div>';
    
    
    
    
    for(var i=1;i<=5;i++)
    {
    var currentoffer = offers.get(i);
    output += "<div style='border: solid;width:800px;'>"

    var msg = "";
    if(i == usero) msg = "<br>(Current offer)";

    output += "<p>" + currentoffer.name + msg + "</p>";
    output += "<p>" + currentoffer.nbmaxworkflow + "</p>";
    output += "<p>" + displayboolean(currentoffer.workflowautomatedallowed) + "</p>";
    output += "<p>" + displayboolean(currentoffer.sendemail) + "</p>";
    output += "<p>" + currentoffer.imagequality_text + "</p>";
    output += "<p>" + displayboolean(currentoffer.attributeallowed) + "</p>";
    output += "<p>" + displayboolean(currentoffer.screenshotallowed) + "</p>";
    output += "<p>" + currentoffer.hotline + "</p>";

    output += "<p>" + displayprice(currentoffer.price) + "</p>";
    output += "<p><button>Subscribe</button></p>";
    output += "</div>"
    }

    output += "<div style='width:700px'>";
    output += "<p>&nbsp;</p>";
    output += "<p>&nbsp;</p>";
    output += "<p>&nbsp;</p>";
    output += "<p>Need more ?</p>";
    output += "<p>Contact us in the chat</p>";


    output +=  '</div>';




    return output + '</div>';



}
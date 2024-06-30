var {offers/*,offer*/} = require ('./data');
var {query} = require('../common/sql.js');
var {islogguedin} = require('./utils.js');
var {offer,sub}  = require ('/home/benji/Documents/WebWorkflowAutomation/orm.js')
const { Op } =require('sequelize');

exports.getcurrentoffer = async function(req)
{


    if(islogguedin(req)) 
    {    
        var anysub = await sub.findOne({
            where: {
                userid: req.session.userid,
              
                startdate: {
                [Op.gte]: new Date()
              },
              enddate: {
                [Op.lte]: new Date()
              },
            },
          });

       
         var offerid;
         if(anysub === null) offerid = 1;
         else offerid = anysub.offerid;
         return await offer.findOne({ where: { id: offerid } });



    }
    else return await offer.findOne({ where: { id: 0} });
}

exports.userhasreachedmaxwf = async function (req)
{
    const user = await user.findOne({
        where: {
          id: req.session.userid,
        },
      });

    var wf = user.getWorkflow();
    var nbauthorized = await exports.getcurrentoffer(req).nbmaxworkflow;

    if(wf.length >= nbauthorised) return true;
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
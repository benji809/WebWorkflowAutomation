var {query} = require('../common/sql.js');
var {getid} = require('../common/utils.js');
var {getcurrentoffer} = require('../common/subscriptions.js')
const {workflow,run}  = require ('/home/benji/Documents/WebWorkflowAutomation/orm.js')
const { Op } =require('sequelize');


function displaystartstoppause(r,s)
{
    if(r == 0)
    {
        if(s == 0) return "&#9654;";//return "Worflow not running";
        if(s == 1) return "||";//return "Worflow will be running soon";
        
        
    }
    if(r == 1)
    {
        //"Worflow running automatically but on pause";
        return "&#9654;";
        
    }
    
    if(r == 2)
    {
        // Worflow running automatically on setup";
         return "||";
        
    }
    
    
}

function displaydate(d)
{
    var a = new Date(d).toString();
    return a.substring(0,21);
}


function displayresult(r)
{
    if(r == "NE") return "<td>-</td>";
    if(r == 0) return "<td>?</td>";
    if(r == 1) return '<td style="border-radius: 30px;background-color:red">&times;</td>';
    if(r == 2) return '<td style="border-radius: 30px;background-color:green">&#10003;</td>';
}

function displayauto(r)
{
    if(r == 0) return "M";
    if(r == 1 || r == 2) return "A";
}

function seedetail(d)
{

if(d == undefined) return d;
var out = '<div class="tooltip">&#x1F441;<span class="tooltiptext">';

for(var i=0;i<d.length;i++)
{

out += '&#8226;' + d[i];
if(i != d.length -1) out += "<br>";
}

out += '</span></div>';
return out;


}

exports.getwf = async function (req)
{
    

    var resultwf = await workflow.findAndCountAll({ where: { userid: getid(req)},   attributes: { exclude: ['screenshot','wf'] } });

    var out = "Your current offer : <b>" + (await getcurrentoffer(req)).name + "</b>"
    
    out+=  "<p>You currently have <b>" + resultwf.count + "</b> workflow(s).";
    out+=  '<p><input type="button" onclick=\'javascript:window.location.assign("?dest=web&action=create")\' value="Design a new workflow"/></p>';
    
    out+=  '<table style="border-spacing: 7px 0 1px 1;">';
    
    
    
    out+=  '<tr><td></td><td  style="border-bottom: solid;"><b>Type</b></td><td style="width:400px;border-bottom: solid;"><b>Start/Stop</b></td><td  style="width:350px;border-bottom: solid;"><b>Name</b></td><td  style="width:350px;border-bottom: solid;"><b>Details</b></td><td  style="width:700px;border-bottom: solid;"><b>Creation</b></td><td  style="border-bottom: solid;"><b>Executed</b></td><td  style="width:300px;border-bottom: solid;"><b>Last execution</b></td><td  style="border-bottom: solid;"><b>Delete</b></td></tr>';
    
    for(var i=0;i<resultwf.count;i++)
        {
        var resultrun = await run.findAndCountAll({ where: { workflowid: resultwf.rows[i].id} });
        var lastresult = "NE";
        var output = "";
        var deploy = "";
        var cwf = resultwf.rows[i].dataValues;
        
        if(resultrun.count > 0) // at least 1 RUN
        {
            deploy = '<a name="mainwf' + cwf.id  + '" href="javascript:deploy(' + cwf.id + ')" ><b>+</b></a>';
            for(var j=0;j<resultrun.count;j++) 
                {
                     var crun = resultrun.rows[j].dataValues;
                     output += '<tr name="wf' + cwf.id + '" style="display:none;"><td></td><td></td><td>' + displaydate(crun.createdAt) + "</td>" + displayresult(crun.result) + "<td>See log</td><td></td><td></td></tr>";
                     if(lastresult == "NE") lastresult = crun.result;
                }

            
        }
     
        
        out+= '<tr><td>' + deploy + '</td><td>' + displayauto(cwf.launcha) + '</td><td><a href="javascript:togglewf(' + cwf.id + ')"><b>' + displaystartstoppause(cwf.launcha,cwf.startm) + "</b></td><td>" + cwf.name +"</td><td>" + seedetail(cwf.wftxt) +" </td><td>" + displaydate(cwf.createdAt) + "</td><td>" + resultrun.count + " times</td>" + displayresult(lastresult) + '<td><a href="javascript:deletewf(' + cwf.id + ')">❌</a></td></tr>';
        out+= output;
            
            
  
    }
     out+= "</table>";
     
     return out;
}
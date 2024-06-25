var {query} = require('../common/sql.js');
var {getid} = require('../common/utils.js');
var {getcurrentoffer} = require('../common/subscriptions.js')



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


return '<div class="tooltip">&#x1F441;<span class="tooltiptext">&#8226;' +  d.replaceAll(",","<br>&#8226;") + '</span></div>';


}

exports.getwf = async function (req)
{
    
    var id = getid(req);
    var result  = await query("SELECT * FROM `workflows` WHERE `userid` = " + id);
    
    var out = "Your current offer : <b>" + getcurrentoffer(req).name + "</b>"
    
    console.log(JSON.stringify(result));
    
    out+=  "<p>You currently have <b>" + result.length + "</b> workflow(s).";
    out+=  '<p><input type="button" onclick=\'javascript:window.location.assign("?dest=web&action=create")\' value="Design a new workflow"/></p>';
    
    out+=  '<table style="border-spacing: 7px 0 1px 1;">';
    
    
    
    out+=  '<tr><td></td><td  style="border-bottom: solid;"><b>Type</b></td><td style="width:400px;border-bottom: solid;"><b>Start/Stop</b></td><td  style="width:350px;border-bottom: solid;"><b>Name</b></td><td  style="width:350px;border-bottom: solid;"><b>Details</b></td><td  style="width:700px;border-bottom: solid;"><b>Creation</b></td><td  style="border-bottom: solid;"><b>Executed</b></td><td  style="width:300px;border-bottom: solid;"><b>Last execution</b></td><td  style="border-bottom: solid;"><b>Delete</b></td></tr>';
    
    for(var i=0;i<result.length;i++)
        {

        var result2  = await query("SELECT * FROM runs WHERE wfid = " + result[i][0] + " ORDER BY creationdate DESC LIMIT 10");

        var nb = result2.length;

        var lastresult = "NE";
        var output = "";
        var deploy = "";
        
        if(nb > 0) // at least 1 RUN
        {
            deploy = '<a name="mainwf' + result[i][0] + '" href="javascript:deploy(' + result[i][0] + ')" ><b>+</b></a>';
            for(var j=0;j<result2.length;j++) 
                {
                     output += '<tr name="wf' + result[i][0] + '" style="display:none;"><td></td><td></td><td>' + displaydate(result2[j][1]) + "</td>" + displayresult(result2[j][2]) + "<td>See log</td><td></td><td></td></tr>";
                     if(lastresult == "NE") lastresult = result2[j][2];
                }

            
        }
     
        
        out+= '<tr><td>' + deploy + '</td><td>' + displayauto(result[i][2]) + '</td><td><a href="javascript:togglewf(' + result[i][0] + ')"><b>' + displaystartstoppause(result[i][2],result[i][5]) + "</b></td><td>" + result[i][7] +"</td><td>" + seedetail(result[i][10]) +" </td><td>" + displaydate(result[i][8]) + "</td><td>" + nb + " times</td>" + displayresult(lastresult) + '<td><a href="javascript:deletewf(' + result[i][0] + ')">❌</a></td></tr>';
        out+= output;
            
            
  
    }
     out+= "</table>";
     
     return out;
}
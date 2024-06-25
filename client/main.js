const puppeteer = require('puppeteer');
const del = "vpm5985apop";
var {query} = require('../webserver/sql.js');


firstrun();
setInterval(run,60000); //runs every minute


async function firstrun()
{



run();

}

async function run()
{



    console.log("Starting loop");
    const response = await fetch('https://www.bestautomation.me/workflow/?action=getallwf');
    const body = await response.text();

     var wf = parsewf(body);
     
     console.log("Received " + wf.length + " workflow(s)");

     for(var i=0;i<wf.length;i++) await execute(wf[i]);
     

}



function parsewf(data)
{
var array = [];

var num = data.split("/-/");
for(var i=0;i<num.length-1;i++)
	{
	  var item = num[i].split("/*/");
	  if(item.length ==2) array.push(item);
	}
return array;
}

function parseactions(action)
{
		var array = action.substring(1,action.length-1).split(",");
		for(var i=0;i<array.length;i++) array[i] = array[i].substring(1,array[i].length-1);
		return array;
}

async function getelement(page,value)
{
		var xp = '::-p-xpath(' +  value +  ')';
		return await page.waitForSelector(xp);
}


async  function iselementpresent(page,value)
{
		try{
		var xp = '::-p-xpath(' +  value +  ')';
		await page.waitForSelector(xp);
		return true;
		}
		catch (e){
		
		return false;
		}

}


async function postresult(id, result)
{
		if(result) result  = 2;
		if(!result) result = 1;

		console.log("I will post the result " + result + " now for id = " + id);
		var response;
		var body = "";
		
		
		while(body != "OK")
		{
		
		 	response = await fetch('https://www.bestautomation.me/workflow/?&action=createrun&wfid=' + id + '&result=' + result);
    		body = await response.text();
    	}

		// send mail for first execution

		var r1 = await query("SELECT userid FROM `workflows` WHERE `id` = " + id);
		var userid = parseInt(r1[0][0]);


 		var r2 = await query("SELECT fwfexecuted,fname FROM `users` WHERE `id` = " + userid);
    	if(parseInt(r2[0][0]) == 0)
    	{
        await sendemail (req.session.email,"fwfexecuted",[["#FIRSTNAME",r2[0][1]]],"Your first workflow was successfully executed");
        await query("UPDATE `users` SET `fwfcreated` = 1 WHERE `id` = " + id);
    	}
	
}



function dispatchp(action)
{
action = action.split(del);
if(action[action.length-1] == "1") action[action.length-1]  = true;
else action[action.length-1]  = false;
var output = [];
for(var i=1;i<action.length;i++) output.push(action[i]);
return output;
}


async function execute(wf)
{

	const browser = await puppeteer.launch({
		args: [
		  '--incognito',
		],
	  });
	  
var page = await browser.newPage(); 
  
 


   try{	
    console.log("WF ID = " + wf[0] + ", wf details = " + wf[1]);

    var actions = parseactions(wf[1]);

    var url = actions[0];
    
    console.log("Going to " + url);
        
    await page.goto(url);
    
    for(i=1;i<actions.length;i++) 
    {
    
		    var action = actions[i];
		    
		    if(action.startsWith("CO")) // clickon
		    {
		    			var vtc = action.substring(2);
		    			console.log("I will click on " + vtc);
		    			var el = await getelement(page,vtc);
					await el.click();
		    }
		    		     
		    if(action.startsWith("IV")) // inputvalue
		    {
		    			var [element, value] = [action.split(del)[1], action.split(del)[2]];
		    			console.log("I will input'" + value + "' on " + element );
		    			var el = getelement(page,element);
		    			el.focus();
		    			await page.keyboard.type(value);
		    }
		    
		    if(action.startsWith("IEE")) //ifelementexist
		    {		    			
		    			var [element, result] = dispatchp(action);
		    			console.log("I have to check if element exist : " + element + "' if so result will be " + result );	
		    			var el = await iselementpresent(page,element);
		    			if(el) postresult(wf[0] ,result);
		    			else postresult(wf[0] ,!result);
		    			return;
		    }
		    	    
		    if(action.startsWith("IEDE")) //ifelementdoesnotexist
		    {		
		    			var [element, result] = dispatchp(action);
		    			console.log("I have to check if element doesn't exist : " + element + "' if so result will be " + result );
		    			var el = await iselementpresent(page,element );
		    			if(!el) postresult(wf[0] ,result);
		    			else postresult(wf[0] ,!result);
		    			return;
		    }
		    
   
		    
		    if(action.startsWith("EVE")) //ifelementattributeequals
		    {
		    			var [element, attribute, value, result] = dispatchp(action);
		    			console.log("I have to check if parameter " + attribute + " of element " + element + " value equals : " + value + " if so result will be " + result );
		    			const n = await page.$('::-p-xpath(' +  element +  ')')
		    			n.attr = attribute;
					let val = await page.$eval("*",n => n.getAttribute("'" + n.attr + "'"));
		    			if(val == value) postresult(wf[0],result);
		    			else postresult(wf[0],!result);		    					
		    			return;
		    }
		    
		    if(action.startsWith("EVNE")) //ifelementattributenotequals
		    {
		    			var [element, attribute, value, result] = dispatchp(action);
		    			console.log("I have to check if parameter " + attribute + " of element " + element + " value not equals " + value + " if so result will be " + result );
		    			const n = await page.$('::-p-xpath(' +  element +  ')')
		    			n.attr = attribute;
					let val = await page.$eval("*",n => n.getAttribute("'" + n.attr + "'"));
		    			if(val != value) postresult(wf[0],result);
		    			else postresult(wf[0],!result);		    					
		    			return;
		    }
		    
		     if(action.startsWith("EVI")) //ifelementattributeincludes
		    {
		    			var [element, attribute, value, result] = dispatchp(action);
		    			console.log("I have to check if parameter " + attribute + " of element " + element + " value includes " + value + " if so result will be " + result );
		    			const n = await page.$('::-p-xpath(' +  element +  ')')
		    			n.attr = attribute;
					let val = await page.$eval("*",n => n.getAttribute("'" + n.attr + "'"));
		    			if(val.includes(value)) postresult(wf[0],result);
		    			else postresult(wf[0],!result);		    					
		    			return;
		    }
		    
		    if(action.startsWith("EVNI")) //ifelementattributenotincludes
		    {
		    			var [element, attribute, value, result] = dispatchp(action);
		    			console.log("I have to check if parameter " + attribute + " of element " + element + " value not includes " + value + " if so result will be " + result );
		    			const n = await page.$('::-p-xpath(' +  element +  ')')
		    			n.attr = attribute;
					let val = await page.$eval("*",n => n.getAttribute("'" + n.attr + "'"));
		    			if(!val.includes(value)) postresult(wf[0],result);
		    			else postresult(wf[0],!result);		    					
		    			return;
		    }
		    
		    
		    
		    
		    
		    
		    if(action.startsWith("PC")) //pagecontainselement
		    {
		    			var [value, result] = dispatchp(action);	
		    			console.log("I have to check if page contains '" + value + "' if so result will be " + result );
		    			const textp = await page.$eval('*', (el) => el.innerText);
		    			if(textp.includes(value)) postresult(wf[0],result);
		    			else postresult(wf[0],!result);
		    			return;		
		    }
		    
		    if(action.startsWith("PNC")) //pagenotcontainselement
		    {
		    			var [value, result]  = dispatchp(action);	
		    			console.log("I have to check if page not contains '" + value + "' if so result will be " + result );
		    			const textp = await page.$eval('*', (el) => el.innerText);
		    			if(!textp.includes(value)) postresult(wf[0],result);
		    			else postresult(wf[0],!result);
		    			return;		
		    }
    
    }
    }
    
catch (e)
{
	console.log("error : " + e);
	
	fetch('https://www.bestautomation.me/workflow/?action=createrun&wfid=' + wf[0] + '&result=0&log=' + e);

	
}
finally
{
   	page.close();
   	browser.close();

}
    

    




}

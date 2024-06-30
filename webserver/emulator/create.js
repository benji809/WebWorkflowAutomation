const {islogguedin} = require('../common/utils.js');
const {session,sessions} = require('../common/data.js');
const puppeteer = require("puppeteer");
const {killsession} = require('./utils.js')
var {userhasreachedmaxwf,getcurrentoffer} = require('../common/subscriptions.js');


async function createsession(req,res)
{

try{
if(req.query.url == "") return;

if(parseInt(req.query.captcha) != parseInt(req.session.captcha)) {res.write("CNC");return;}

if(islogguedin(req))
{

    if(await userhasreachedmaxwf(req)) {res.write("MR");return;}
    if((await getcurrentoffer(req)).sendemail == 0 && req.query.sendm == "1") {res.write("SENDMNA");return;}
    if((await getcurrentoffer(req)).workflowautomatedallowed == 0 && req.query.startm == "1") {res.write("STARTMNA");return;}
    if((await getcurrentoffer(req)).everymin > parseInt(req.query.every)) {res.write("STARTEVERYNA");return;}
}

if(!islogguedin(req))
{

    if(req.query.sendm == "1")  {res.write("SENDMNA");return;}
    if(req.query.startm == "1")  {res.write("STARTMNA");return;}

}



const browser = await puppeteer.launch({
    args: [
      '--incognito',
    ],
  });
  
var page = await browser.newPage(); 
await page.goto(req.query.url);
await page.setViewport({ width: 1920, height: 1080});

     await page.exposeFunction('processClick', (data) => {
      sessions.get(req.session.id).messagetosend.push("##CO" + data);
    });

   await page.evaluate(() => {
      
      var getNodeXPath = function(node) {
    if (node && node.id)
        return '//*[@id="' + node.id + '"]';
   else
        return getNodeTreeXPath(node);
};

var getNodeTreeXPath = function(node) {
    var paths = [];

    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    for (; node && (node.nodeType == 1 || node.nodeType == 3) ; node = node.parentNode)  {
        var index = 0;
        // EXTRA TEST FOR ELEMENT.ID
       if (node && node.id) {
            paths.splice(0, 0, '/*[@id="' + node.id + '"]');
            break;
        }

        for (var sibling = node.previousSibling; sibling; sibling = sibling.previousSibling) {
            // Ignore document type declaration.
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                continue;

            if (sibling.nodeName == node.nodeName)
                ++index;
        }

        var tagName = (node.nodeType == 1 ? node.nodeName.toLowerCase() : "text()");
        var pathIndex = (index ? "[" + (index+1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/") : null;
};
      
      
      
      
      
      document.addEventListener(
        'click',
        (event) => { window.processClick(getNodeXPath(event.target)); }, // Here you can send the data to Node.js context.
      );
      
  
      
      
    });
    
    

    var t = setTimeout(killsession, (await getcurrentoffer(req)).timeout*1000,req.session.id);
 

    
    
    sessions.set(req.session.id,new session("",browser,page,"",[],t));
    res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin':'*'});
    res.write("OK");
    
    }
    catch(e)
    {
    console.log(e);
    res.write("NOK");
    
    }
    finally
    {
    res.end(); 
    
    }
    
}



module.exports = {createsession}
 

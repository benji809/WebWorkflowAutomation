const {generaterandomid} = require('../common/utils.js');
const {session,sessions} = require('./data.js');
const puppeteer = require("puppeteer");
const del = require('./data.js');

async function createsession(req,res)
{

try{
if(req.query.url == "") return;

var browser = await puppeteer.launch()//{headless: false});
var page = await browser.newPage(); 
await page.goto(req.query.url);
await page.setViewport({ width: 1920, height: 1080});
var s = generaterandomid(64);


     await page.exposeFunction('processClick', (data) => {
      sessions.get(s).messagetosend.push("##CO" + data);
    });


    await page.exposeFunction('processChange', (data1,data2,del) => {
      sessions.get(s).messagetosend.push("##IV" + data1 + del + data2);
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
      
         document.addEventListener(
        'change',
        (event) => { window.processChange(getNodeXPath(event.target),event.target.value); }, // Here you can send the data to Node.js context.
      );
      
      
      
      
    });
    
    
    var timer = setTimeout(() => {
  console.log("Session autokilled : " + s);
  sessions.delete(s);
	}, "60000");



    
    
    sessions.set(s,new session("",browser,page,"",[],timer));
    res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin':'*'});
    res.write("OK" + s);
    
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
 

const fs = require('node:fs');


exports.getfilecontent = function (file)
{

try {
  return fs.readFileSync('web/tpl/' + file, 'utf8');
} catch (err) {
  console.error(err);
}
}


exports.getfile = function (file)
{

try {
  return [fs.readFileSync('web/files/' + file),getheader(file)];
} catch (err) {
  console.error(err);
}
}

function getheader(file)
{
if(file.endsWith(".js")) return "text/javascript";
if(file.endsWith(".jpeg") || file.endsWith(".jpg")) return "image/jpeg";
if(file.endsWith(".css") || file.endsWith(".jpg")) return "text/css";
if(file.endsWith(".png") || file.endsWith(".jpg")) return "image/png";
}




/*$landingpage = 'LinkedinUltimate is the ultimate tool to automatize all your actions on Linkedin right under your eyes in your browser:<br><br>
    <table style="margin: auto;"><tr><td>👉</td><td> Autoconnect with all people in your search result</td></tr>
   <tr> <td>👉</td><td>  Autosend personnalised message to all people in your search result</td></tr>
    <tr> <td>👉</td><td>  Export a search result to an excel file</td></tr>
   <tr> <td>👉</td><td>Clean your old sent invitations</td></tr>
   <tr> <td>👉</td><td> Export all the #opentowork people in your network to a single excel file</td></tr>
   <tr> <td>👉</td><td> Change background color & personnalize your theme</td></tr>
  <tr> <td>👉</td><td> Remove adds</td></tr></table><br><br>
    
    
    and many more to come !<br>
    
    <p style="text-align:right;"><b><i>"Thank you, this is a true masterpiece of automation !"<br>"I am now able to spot & message the #opentowork people very easily."<br>"Wow, everything is working under my watch in my browser..magic!"</b></i></p>';
    
exports.pricing = '<b>What you get :</b><br><br>
    <table style="margin: auto;"><tr><td>👉</td><td>  Unlimited Autoconnect to all people on a defined search</td></tr>
    <tr> <td>👉</td><td>  Unlimited Autosend personnalised message to all people on a defined search</td></tr>
    <tr> <td>👉</td><td>  Unlimited Export of search result to an excel file</td></tr>
    <tr> <td>👉</td><td> Unlimited Clean your old invitations</td></tr>
    <tr> <td>👉</td><td>  Unlimited Export all the #opentowork people in your network to an excel file</td></tr>
    <tr> <td>👉</td><td>  Unlimited Change of background color</td></tr>
    <tr> <td>👉</td><td>  Unlimited Adds removal</td></tr></table><br><br>
    <br><br>
    
      🎁 <u>Flash offer : 2 weeks free trial, then 2.99€/month </u> 🎁 ';*/
      



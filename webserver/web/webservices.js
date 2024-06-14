var {query} = require('../common/sql.js');
var {islogguedin} = require('../common/utils.js');
const {generaterandomid} = require('../common/utils.js');


exports.createwf = function (req)  // TBD
{

	if(!islogguedin(req)) return "NC";

    var data = JSON.parse(req.query.data);

    data = cleandata(data);
   
    var result = query("INSERT INTO `workflows`(`wf`, `launcha`, `startdate`, `every`, `sendemail`, `name`, `creationdate`) VALUES ('" + data[4] + "'," + data[1] + "," + data[3] + "," + data[2] + "," + data[5] + ",'" + data[0] + "'," + time() + ")");
    
    return "OK";


}

exports.dologin = async function (req)
{
	var email = req.query.email;
    var password = req.query.password;
    
    if(email == "" || password == "") return;
    
    var result = await query("SELECT activation, id FROM users WHERE `email` = '" + email + "' AND `password` = '" + password + "'");

    if(result.length == 0) return "NOK";
    
    if(result[0] != "") return "NA";
    
    req.session.isLoggedIn = true;
    req.session.id = result[1];
    return "OK";
}

exports.dologout = function (req)
{
    req.session.isLoggedIn = false;
    req.session.id = undefined;
    return "OK";
}


exports.doregister = async function (req)
{

    var email = req.query.email;
    var password = req.query.password;
    var fname =  req.query.fname;
    var lname =  req.query.lname;
    var job =  req.query.job;
    var company =  req.query.company;
    var how =  req.query.how;
    
    
    if(email == "" ||  password == "" || fname == "" || lname == "" || how== "") return;
    
    
    var result = await query("SELECT * FROM users WHERE `email` = '" + email + "'");
    if(result.length != 0) {return "EAE";}   //email already exist
  
    activation = generaterandomid(64);

    // create account in DB

    result = await query("INSERT INTO `users`(`email`, `fname`, `lname`, `password`,`activation`,`job`,`company`,`how`) VALUES ('" + email + "','" + fname +"','" + lname + "','" + password + "','" + activation + "','" + job + "','" + company + "','" + how+ "')");
     //echo "INSERT INTO `users`(`email`, `fname`, `lname`, `password`,`activation`,`job`,`company`,`how`) VALUES ('".$email."','".$fname."','".$lname."',".$password.",'".$activation."','".$job."','".$company."','".$how."')";

     if(result) 
     {
     return "OK";
     //sending mail here !!
     }
     else return "NOK";




}
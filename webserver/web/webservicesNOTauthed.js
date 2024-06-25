var {query,formatforsql,formatfortext} = require('../common/sql.js');
const {generaterandomid} = require('../common/utils.js');
var {sendemail} = require('../common/mail.js');


exports.activate = async function (req) // secured
{
    var key = req.query.activationkey;
    if(key == "") return;
    var result = await query("SELECT * FROM `users` WHERE activation = '" + key + "'");
    if(result.length == 0) return "This activation key could not be recognised. Please try again or contact us at contact@bestautomation.me.";
    await query("UPDATE `users` SET `activation`='' WHERE activation = '" + key + "'");
    sendemail(result[3],"activated",[["#FIRSTNAME",result[1]]],"Your account is now active, you can log in.");
    return "Your account is now active, you can log in."; 
    
}

exports.dorecover = async function (req) // secured
{
    var email = req.query.email;
    if(email == "") return;

    var result = await query("SELECT * FROM `users` WHERE email = '" + email + "'");
    if(result.length == 0) return "OK";

    var recover= generateRandomid(64);
    await query("UPDATE `users` SET `recover`='" + recover + "' WHERE `email` = '" + email + "'");
    sendemail(result[3],"recover",[["#FIRSTNAME",result[1]],["#RECOVERKEY",recover]],"Recover your account");
    return "OK";
}

exports.dologin = async function (req) // secured
{
	var email = req.query.email;
    var password = req.query.password;
    
    if(email == "" || password == "") return;
    
    var result = await query("SELECT activation, id FROM users WHERE `email` = '" + email + "' AND `password` = '" + password + "'");

    if(result.length == 0) return "NOK";

    if(result[0][0] != "") return "NA";
    
    req.session.isLoggedIn = true;
    req.session.userid = result[0][1]; 
    req.session.email = email;

    // go fetch the offerid of the user. TO UPDATE when sub changes..

    var offerid = await query("SELECT offerid FROM sub WHERE userid = " + req.session.userid + " AND  CURRENT_TIMESTAMP > startdate AND (CURRENT_TIMESTAMP < enddate OR enddate = '0000-00-00 00:00:00.000000')");
    if(offerid.length == 0) req.session.offerid = 1;
    else req.session.offerid = parseInt(offerid[0][0]);
    return "OK";
}




exports.doregister = async function (req) // secured
{

    var email = req.query.email;
    var password = req.query.password;
    var fname =  formatforsql(req.query.fname);
    var lname =  formatforsql(req.query.lname);
    var job =  formatforsql(req.query.job);
    var company =  formatforsql(req.query.company);
    var how =  req.query.how;
    var country =  req.query.country;
    
    
    if(email == "" ||  password == "" || fname == "" || lname == "" || how== "" || country == "") return;
    
    
    var result = await query("SELECT * FROM users WHERE `email` = '" + email + "'");
    if(result.length != 0) {return "EAE";}   //email already exist
  
    activation = generaterandomid(64);

    // create account in DB

    result = await query("INSERT INTO `users`(`email`, `fname`, `lname`, `password`,`activation`,`job`,`company`,`how`,`country`) VALUES ('" + email + "','" + fname +"','" + lname + "','" + password + "','" + activation + "','" + job + "','" + company + "','" + how+ "','" + country+ "')");
     //echo "INSERT INTO `users`(`email`, `fname`, `lname`, `password`,`activation`,`job`,`company`,`how`) VALUES ('".$email."','".$fname."','".$lname."',".$password.",'".$activation."','".$job."','".$company."','".$how."')";

     if(result) 
     {
     await sendemail (email,"welcome",[["#FIRSTNAME",formatfortext(fname)],["#ACTIVATIONKEY",activation]],"Activate your account with this e-mail");
     return "OK";
     }
     else return "NOK";




}

exports.changepassword = async function (req) // secured
{
    var key = req.query.recoverkey;
    var password = req.query.password;
    if(key== "" || password == "") return;

    var result = await query("SELECT * FROM `users` WHERE `recover` = '" + key + "'");
    if(result.length == 0) return "NOK";
   
    var result2 = await query("UPDATE `users` SET `recover`='',`password` = '" + password + "' WHERE `recover` = '" + key + "'");
    if(result2) 
    {
    sendemail(result[3],"recovered",[["#FIRSTNAME",result[1]]],"Password recovered");
    return "OK"; // sending email HERE
    }
    else return "NOK";
}
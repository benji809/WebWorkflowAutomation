var {query} = require('../common/sql.js');
const {generaterandomid} = require('../common/utils.js');


exports.activate = async function (req)
{
    var key = req.query.key;
    if(key == "") return;
    var result = await query("UPDATE `users` SET `activation`='' WHERE activation = '" + key + "'");
    if(result) return "Your account is now active, you can log in."; // SEND EMAIL
    else return "This id could be recognised. Please try again or contact us.";
}

exports.dorecover = async function (req)
{
    var email = req.query.email;
    if(email == "") return;
    var recover= generateRandomid(64);
    await query("UPDATE `users` SET `recover`='" + recover + "' WHERE `email` = '" + email + "'");
    //SENDING EMAIL HERE !!
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
    req.session.userid = result[1]; 
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

exports.changepassword = async function (req)
{
    var key = req.query.key;
    var password = req.query.password;
    if(key== "" || password == "") return;
    var result2 = await query("UPDATE `users` SET `recover`='',`password` = '" + password + "' WHERE `recover` = '" + key + "'");
    if(result2) return "OK"; // sending email HERE
    else return "NOK";
}
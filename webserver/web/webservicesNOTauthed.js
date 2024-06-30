var {query,formatforsql,formatfortext} = require('../common/sql.js');
const {generaterandomid} = require('../common/utils.js');
var {sendemail} = require('../common/mail.js');
const {user,sub}  = require ('/home/benji/Documents/WebWorkflowAutomation/orm.js')
const { Op } =require('sequelize');


exports.activate = async function (req) // secured
{
    var key = req.query.activationkey;

    var record = await user.update(
        { activation : '' },
        {
          where: {
            activation: key,
          },
        },
      );

    if(record[0] != 1) return "This activation key could not be recognised. Please try again or contact us at contact@bestautomation.me.";
    else return "OK";
}

exports.dorecover = async function (req) // secured
{
    var email = req.query.email;
    if(email == "") return;
    var recoverkey = generateRandomid(64);

    var record = await user.update(
        { recover : recoverkey},
        {
          where: {
            email: email,
          },
        },
      );

    if(record[0] == 1)  sendemail(req.session.email,"recover",[["#FIRSTNAME",req.session.fname],["#RECOVERKEY",recoverkey]],"Recover your account");
    return "OK";
}

exports.dologin = async function (req) // secured
{

	var email = req.query.email;
    var password = req.query.password;
    
    if(email == "" || password == "") return;

    var result = await user.findOne({ where: { email: email , password : password } });

    if(result === null) return "NOK";

    if(result.activation != "") return "NA";
    
    req.session.isLoggedIn = true;
    req.session.userid = result.id;
    req.session.email = email;
    req.session.fname = result.fname;

    return "OK";
}




exports.doregister = async function (req) // secured
{

    var email = req.query.email;
    var password = req.query.password;
    var fname =  req.query.fname;
    var lname =  req.query.lname;
    var job =  req.query.job;
    var company =  req.query.company;
    var how =  req.query.how;
    var country =  req.query.country;
    
    
    if(email == "" ||  password == "" || fname == "" || lname == "" || how== "" || country == "") return;
    
    
    var result = await user.findOne({ where: { email: email , password : password } });
    if(result !== null)  {return "EAE";}   //email already exist
  
    activation = generaterandomid(64);

    // create account in DB


     await user.create({ 
        email: email,
        fname : fname,
        lname : lname,
        password : password,
        job : job,
        company : company,
        how : how,
        country : country,
        activation : activation,
        recover : ""
     });


     await sendemail (email,"welcome",[["#FIRSTNAME",formatfortext(fname)],["#ACTIVATIONKEY",activation]],"Activate your account with this e-mail");
     return "OK";
}

exports.changepassword = async function (req) // secured
{
    var key = req.query.recoverkey;
    var password = req.query.password;
    if(key== "" || password == "") return;

    var record = await user.update(
        { 
            recover : '',
            password : password
        },
        {
          where: {
            recover: key,
          },
        },
      );

    if(record[0] == 1)
        {
            sendemail(req.session.email,"recovered",[["#FIRSTNAME",req.session.fname]],"Password recovered");
            return "OK";
        }
        else return "NOK";
}
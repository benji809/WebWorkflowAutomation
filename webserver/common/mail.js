const nodemailer = require("nodemailer");
const fs = require('node:fs');

const transporter = nodemailer.createTransport({
    host: "mail.bestautomation.me",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "noreply@bestautomation.me",
      pass: "]bQ_s&iF(2TU",
    },
  });



  exports.sendemail = async function (recipient,tpl,replace, subject)
  {

    try {
      
    var output = fs.readFileSync('common/mails/header', 'utf8') +  fs.readFileSync('common/mails/' + tpl, 'utf8')   + fs.readFileSync('common/mails/footer', 'utf8')
    replace.map(element => output = output.replace(element[0],element[1]));
        
    const info = await transporter.sendMail({
        from : "noreply@bestautomation.me",
        to: recipient,
        subject: 'Best Automation |' + subject , // Subject line
        text: "", // plain text body
        html: output, // html body
      });
    
      console.log("Message sent: %s", JSON.stringify(info));

    return 
} catch (err) {
  console.error(err);
}

  }
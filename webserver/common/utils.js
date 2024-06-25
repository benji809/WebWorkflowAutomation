exports.generaterandomid = function(length)
{
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

exports.islogguedin = function(req)
{

    if(req.session.isLoggedIn && req.session.userid != -1) return true;
    return false;
    


}

exports.getid = function(req)
{
    return req.session.userid;
}

exports.cleandata = function (data)
{


if(data == "on") data = 1;
if(data == "") data = 0;
   

return data;
}
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

for(var i=0;i<6;i++)
{
        if(data[i] == "on") data[i] = 1;
        if(data[i] == "") data[i] = 0;
   
}
if(data[1] == 1) data[1] = 2; // will pause otherwised
data[3] = Date.parse(data[3]);

return data;
}
exports.validation = function(input)
{

if(input.dest == "" || input.dest == undefined || input.action == undefined || input.action == "") return false;

var String = [input.dest,input.action,input.how,input.country];
for(var i=0;i<String.length;i++)
	{
	if(!checkstring(String[i])) return false;
	}

var Stringwp = [input.fname,input.lname,input.job,input.company,input.name];
	for(var i=0;i<Stringwp.length;i++)
	{
	if(!checkstringwithspace(Stringwp[i])) return false;
	}


if(!checkemail(input.email)) return false;

if(!checkfile(input.file)) return false;

var alphanum = [input.password,input.recoverkey,input.activationkey,input.id];
for(var i=0;i<alphanum.length;i++)
	{
		if(!checkalphanum(alphanum[i])) return false;
	}

var integers  = [input.key,input.every,input.captcha];
for(var i=0;i<integers.length;i++)
	{
		if(!checkinteger(integers[i])) return false;
	}

var float = [input.x,input.y,input.dy,input.w,input.h];
for(var i=0;i<float.length;i++)
	{
		if(!checkfloat(float[i])) return false;
	}

if(!checkurl(input.url)) return false;

if(!checktime(input.starttime)) return false;

var binary = [input.startm,input.sendemail];
for(var i=0;i<binary.length;i++)
	{
		if(!checkbinary(binary[i])) return false;
	}


return true;
}

function checkstring(input)
{
	if(input == undefined || input == "") return true;
	if(typeof input !== 'string') return false;
	if(input.length > 15 || input.length < 3) return false;
	const regex = /[A-Za-z]+/gm;
	if(!input.match(regex)) return false;
	return true;
}

function checkstringwithspace(input)
{
	if(input == undefined || input == "") return true;
	if(typeof input !== 'string') return false;
	if(input.length > 15 || input.length < 3) return false;
	const regex = /[A-Za-z ]+/gm;
	if(!input.match(regex)) return false;
	return true;
}

function checkfile(input)
{
	if(input == undefined) return true;
	if(typeof input !== 'string') return false;
	if(input.length > 15) return false;
	const regex = /[A-Za-z0-9]+\.[A-Za-z0-9]+/gm;
	if(!input.match(regex)) return false;
	return true;
}

function checkbinary(input)
{
	if(input == undefined ||input == "" ) return true;
	if(input == "0" || input == 0) return true;
	if(input == "1" || input == 1) return true;

	return false;
}

function checkemail(input)
{
	if(input == undefined) return true;
	var emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return input.match(emailValidator);
}

function checkalphanum(input)
{
	if(input == undefined) return true;
	const regex = /[a-zA-Z0-9]+/gm;
	return input.match(regex);
}

function checkinteger(input)
{
	if(input == undefined ||input == "" ) return true;
	try{
		input = parseInt(input);
		return true;
	}
	catch(e)
	{
	return false;

	}

}

function checkfloat(input)
{
	if(input == undefined) return true;
	try{
		input = parseFloat(input);
		return true;
	}
	catch(e)
	{
	return false;

	}

}

function checkurl(input)
{
	if(input == undefined) return true;
	return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(input);
}

function checktime(input)
{
	if(input == undefined || input == "") return true;
	try{
		input = Date.parse(input);
		return true;
	}
	catch(e)
	{
	return false;

	}
}

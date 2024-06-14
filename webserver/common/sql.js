//const mariadb = require('mariadb');
const fetch = require('node-fetch');


exports.query= async function (q)
{

    console.log("rquest is " + q )
const response = await fetch("https://www.bestautomation.me/workflow/proxysql.php?r=" + q);
var data = await response.text();
console.log("response is " + data )
if(data == "null") return [];
if(data == "true") return "true";
if(data == "false") return "false";


return JSON.parse(data);

    /*
const con = mariadb.createPool({
    host: "109.234.164.193",
    user: "opmp8948_sql",
    password: "SQLopmp89484212..",
    database: "opmp8948_wf"
})


await con.getConnection();

console.log("we are connected")

var result = await con.query(q);

console.log("get result "+ result);

return result;*/

}


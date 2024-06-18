//const mariadb = require('mariadb');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest


exports.query= async function (q)
{

  
    let myPromise = new Promise( function( resolve, reject ) {
	
		let xhr = new XMLHttpRequest()
		
		xhr.open( 'GET',  "https://www.bestautomation.me/workflow/proxysql.php?r=" + q )
		
		xhr.onload = function() {
			
			if ( xhr.status == 200 ) {
				
				resolve( xhr.responseText )
				
			} else {
				
				reject( `Error: ${xhr.status}` )
				
			}
		}
		
		xhr.send()
		
	} )

            var data = await myPromise
            if(data == "null") return [];
            if(data == "true") return "true";
            if(data == "false") return "false";
            return JSON.parse(data);
        
   

}


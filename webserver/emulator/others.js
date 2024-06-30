var {getcurrentoffer} = require('../common/subscriptions.js');
var {screenshots} = require('../common/data.js')

exports.mousedown = async function (s)
{
   try{
   await s.page.mouse.down();
   }
   catch(e)
   {
   	console.log(e);
   }
}

exports.mouseup = async function (s)
{
   try{
   await s.page.mouse.up();
   }
   catch(e)
   {
   	console.log(e);
   }
}

exports.move = async function (s,x,y)
{
   try{
   await s.page.mouse.move(parseInt(x),parseInt(y));
   }
   catch(e)
   {
   	console.log(e);
   }

}

exports.keyboard = async function (s,key)
{
   try{

   for(var i=0;i<10;i++) if(key == "Numpad" + i) key = i.toString();   

   await s.page.keyboard.press(key);

   }
   catch(e)
   {
   	console.log(e);
   
   }

}


exports.screenshot = async function (s,x,y,w,h,req)
{
  try{
   
   var screenshot= await s.page.screenshot({ encoding: "base64" , quality : 10, type: 'jpeg', clip: {
      x: parseInt(x),
      y: parseInt(y),
      width: parseInt(w),
      height: parseInt(h)
    }});

   s.messagetosend.push("SC##" + screenshot);
   s.screenshot = screenshot;

   }
   catch(e)
   {
      console.log(e);
   
   }



}

exports.scroll = async function (s,dy)
{
   try{
   await s.page.mouse.wheel({deltaY: parseInt(dy)*10});
   }
   catch(e)
   {
   	console.log(e);
   }
}


exports.sif = async function(req,res)
{
   var options = ["Add condition","If element","If page","If attribute","If screenshot"];
   var data = '<select onChange="refreshif()" id="selectif">';
    
   for(var i= 0;i<options.length;i++) 
   {
      var disabled = "";
      if(options[i] == "If screenshot" && (await getcurrentoffer(req)).screenshotallowed == 0) disabled = "disabled";
      if(options[i] == "If attribute" && (await getcurrentoffer(req)).attributeallowed == 0) disabled = "disabled";
      data += "<option " + disabled + " value = '" + i + "'>" + options[i] + "</option>";
   }
    data += "</select>";
    res.write(data);
    console.log(data);
   
}

exports.getvideo = async function (s,res,req)
{
	
      var quality = (await getcurrentoffer(req)).imagequality_value;
		
		res.writeHead(400, {
		    'Content-Type': 'text/event-stream',
		    'Connection': 'keep-alive',
		    'Access-Control-Allow-Origin':'*'
		});
    	 	setInterval(async function sc()
    	 	{
         try{
            var screenshot= await s.page.screenshot({ encoding: "base64" , quality: quality, type: 'jpeg'});
    	 		res.write("BEG##" + screenshot + "END##");

    	 	if(s.messagetosend.length != 0)
    	 	{
    	 		res.write("MES##" + JSON.stringify(s.messagetosend));
    	 		s.messagetosend = [];
    	 	}
         }
         catch (e)
         {

            clearTimeout(this);
         }
    	 	
    	 	},1000);

}


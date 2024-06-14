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
   
   await s.page.keyboard.press(String.fromCharCode(key));

   }
   catch(e)
   {
   	console.log(e);
   
   }

}


exports.screenshot = async function (s,x,y,w,h)
{
  try{
   
   var screenshot= await s.page.screenshot({ encoding: "base64" , quality: 20, type: 'jpeg', clip: {
      x: x,
      y: y,
      width: w,
      height: h
    }});

   s.messagetosend.push("##SC" + screenshot);

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


exports.getvideo = async function (s,res)
{
	
		
		res.writeHead(400, {
		    'Content-Type': 'text/event-stream',
		    'Connection': 'keep-alive',
		    'Access-Control-Allow-Origin':'*'
		});
    	 	setInterval(async function sc()
    	 	{
    	 	var screenshot= await s.page.screenshot({ encoding: "base64" , quality: 20, type: 'jpeg'});

    	 	
    	 	if(s.screenshot != screenshot)
    	 	{
    	 		res.write("BEG##" + screenshot + "END##");
    	 		s.screenshot = screenshot
    	 	}
    	 	if(s.messagetosend.length != 0)
    	 	{
    	 		res.write("MES##" + JSON.stringify(s.messagetosend));
    	 		s.messagetosend = [];
    	 	}
    	 	
    	 	},1000);

}


function updateworkflow(el1,el2)
{
                let select_item = document.getElementById("workflow");
                let options = select_item.getElementsByTagName('option');
                if(options.length > 1){
                if(options[options.length-1].innerText.includes("If")) {alert("Your worklow has already its last action, please save it now to");return;}
                }
                
                var opt = document.createElement("option");
    			opt.value = el1;
    			opt.text = opt.value;
    			document.getElementById('workflow').add(opt,null);
                
                opt = document.createElement("option");
    			opt.value = el2;
    			opt.text = opt.value;
    			document.getElementById('workflowts').add(opt,null);
}


function listenMessage(msg) {
    
    console.log(msg);
    
    try{
    if(msg.includes("##") && recording)
    {
        
                if(msg.startsWith("##CO")) // click on element
                {
          


                    if(recordobject === false)
                    {
                        
                        var el = msg.substring(4);
                        var select = document.getElementById('workflowts').options;
                        for(var i=0;i<select.length;i++)
                            {
                            if(select[i].innerText == "##CO<>")
                                {
                                  select[i].innerText = "##CO" + el;
                                  document.getElementById('workflow').options[i].innerText = "Click on " + el;
                                  return;
                                }
                                
                            }
                    }
                    else
                    {
                        document.getElementById('ets').innerHTML = el;
                    }
                }
             
                if(msg.startsWith("SC##")) // screenshot
                {
                var data = msg.substring(4);
                var sc= document.getElementById("screenshot")
                sc.src = 'data:image/png;base64,' + data;
                }
                
                

        
        
    }
 


    }
    catch(e)
    {
        
        
        
    }
    
}







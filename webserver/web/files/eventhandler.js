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
    
    console.log("recording " + msg);
    
    try{
    if(msg.includes("##") && recording)
    {
        
                if(msg.startsWith("##CO")) 
                {
                    var el = msg.substring(4);
                    if(recordobject === false)
                    {
                        
                        updateworkflow("Click on " + el,"CO" + el);
                    }
                    else
                    {
                        document.getElementById('ets').innerHTML = el;
                    }
                }
                if(msg.startsWith("##IV"))
                {
                    var el = msg.split(del)[1];
                    var val = msg.split(del)[2];
                    updateworkflow("Input value " + val + " on "+  el,"IV" + del + el + del + val);    
                }
                

        
        
    }
 


    }
    catch(e)
    {
        
        
        
    }
    
}

window.addEventListener("message", listenMessage, false);

navigator.serviceWorker.addEventListener('message', function handler (event) {

      if(event.data.startsWith(">>ST1"))
    {
        var outm;
        dd += parseInt(event.data.substring(5));
        if(dd < 1024) outm = dd + " o";
        if(dd > 1024 && dd < 1024*1024) outm = parseInt(dd/2014) + " ko";
        if(dd > 1024*1024) outm = parseInt(dd/(1024*1024)) + " Mo";
        document.getElementById("dd").innerHTML = "Data downloaded for this session : ~" + outm;
        
        nbfiles++;
        document.getElementById("nbfd").innerHTML = "NB files downloaded for this session : " + nbfiles;

    }
});





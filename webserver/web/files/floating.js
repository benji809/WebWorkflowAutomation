document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("sif").innerHTML = createselect("selectif","refreshif",["Add condition","If element","If attribute","If page"]);
    const urlParams = new URLSearchParams(window.location.search);
    stream("?dest=emulator&action=getvideo&id=" + id);
    updateworkflow("Browsing to " + url,url);


document.getElementById("img").addEventListener("mousemove", (e) => {
    x = e.pageX - e.currentTarget.offsetLeft;
    y = e.pageY - e.currentTarget.offsetTop;
    
});

document.getElementById("img").addEventListener("mousedown", (e) => {
    fetch(baseurl + "mousedown");
});

document.getElementById("img").addEventListener("mouseup", (e) => {
    fetch(baseurl + "mouseup");
});

document.getElementById("img").addEventListener("keypress", (e) => {
    fetch(baseurl + "keyboard&key=" + e.keyCode);
});


document.getElementById("img").addEventListener("DOMMouseScroll", (event) => {

 dy += event.detail;
 
});




});


function savew()
{
				let select_item = document.getElementById("workflow");
                let options = select_item.getElementsByTagName('option');
                
                if(options.length == 1) {alert("Your workflow is empty");return;}
            
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                
                
                var wf = [];
                
                wf.push(encodeURIComponent(options[0].innerText));
                for (var i=1; i < options.length ; i++)  wf.push(options[i].innerText);

                var array_out = [urlParams.get('name'),urlParams.get('selectlaunch'),urlParams.get('every'),urlParams.get('meeting-time'),wf,urlParams.get('sendemail')];
                
				console.log(JSON.stringify(array_out));
				

                fetch("https://www.bestautomation.me/workflow/?action=docreate&data=" + JSON.stringify(array_out))
                    .then((response) => {
                      return response.text();
                    })
                    .then((data) => {
                      console.log(data);
                      if(data == "NC")
                      {
                          alert("You are not loggued-in, your workflow will not be saved");
                      }
                      else if(data == "OK")
                      {
                          alert("Workflow saved!");
                          document.location = "?action=getwf";
                          
                          
                      }
                      else
                      {
                           alert("Unexpected error. Our team has been alerted and will be looking into it");
                      }
                 
                    })
				
				
                  
    
}

function resetw()
{

                
                let select_item = document.getElementById("workflow");
                let options = select_item.getElementsByTagName('option');

                for (var i=options.length -1; i > 0 ; i--)  select_item.removeChild(options[i]);
                
                select_item = document.getElementById("workflowts");
                options = select_item.getElementsByTagName('option');

                for (var i=options.length -1; i > 0 ; i--)  select_item.removeChild(options[i]);

                document.getElementById("selectif").options[0].selected = true;
                refreshif();
                recordobject = false;
}

function cancelw()
{
	window.location.href = "https://www.bestautomation.me/workflow/";
    
}

function createselect(id,onchange,options)
{

    var data = '<select onChange="' + onchange + '()" id="' + id + '">';
    for(var i= 0;i<options.length;i++) data += "<option value = '" + i + "'>" + options[i] + "</option>";
    data += "</select>";
    return data;
}

function handleinput(t)
{
    if(t.getAttribute("first") == 1)
    {
        
        t.value = "";
        t.setAttribute("first",0);
    }
}

function createinput(value)
{

    return '<input first=1 id="' + value + '" onclick="handleinput(this);" value="' + value + '"/>';

}


function checkfield(field)
{
    if(document.getElementById(field).value == "" || document.getElementById(field).getAttribute("first") == "1") return false;
    else return true;
}

function checkselect(select)
{
    if(document.getElementById(select).selectedIndex == 0) return false;
    else return true;
}

function checkets()
{
    if(document.getElementById("ets").innerText == "No element selected yet : click any element of the page below to select it")  return false;
    else return true;
}

function check(mode)
{
    if(mode == 1)
    {
        if(!checkets() || !checkselect("selectif3"))
        {
            alert("Please complete all fields");
            return false;
        }
    }
    
    if(mode == 2)
    {
        if(!checkets() || !checkfield("attribute") ||!checkfield("value")  || !checkselect("selectif2") || !checkselect("selectif3"))
        {
            alert("Please complete all fields");
            return false;
        }
    }
    if(mode == 3)
    {
        if(!checkfield("value") || !checkselect("selectif2") || !checkselect("selectif3"))
        {
            alert("Please complete all fields");
            return false;
        }
    }
    
    return true;
}


function pause()
{
    if(recording) document.getElementById("pause").innerHTML = "Paused (RECORD)";
    else   document.getElementById("pause").innerHTML = "Recording (PAUSE)";
    recording = !recording;  
    
}

function add(){
    
    var select = document.getElementById("selectif").selectedIndex;
    if(select == 0) return;
    
    var txt = "If ";
    var txt2;
    
    if(select == 1) 
    {
            if(!check(1)) return;
            txt += "element ["   + document.getElementById("ets").innerText  + "] " +  document.getElementById("selectif2").options[document.getElementById("selectif2").selectedIndex].innerText  + " Then " +  document.getElementById("selectif3").options[document.getElementById("selectif3").selectedIndex].innerText;
            if(document.getElementById("selectif2").selectedIndex == 1) txt2 = "IEE";
            if(document.getElementById("selectif2").selectedIndex == 2) txt2 = "IEDE";
            txt2 += del + document.getElementById("ets").innerText + del + document.getElementById("selectif3").selectedIndex;
    }
    if(select == 2) 
    {
            if(!check(2)) return;
            txt += "attribute ["   + document.getElementById("attribute").value + "] of element [" +  document.getElementById("ets").innerText  + "] " +  document.getElementById("selectif2").options[document.getElementById("selectif2").selectedIndex].innerText  + " [" + document.getElementById("value").value + "] Then " +  document.getElementById("selectif3").options[document.getElementById("selectif3").selectedIndex].innerText;
            if(document.getElementById("selectif2").selectedIndex == 1) txt2 = "EVE";
            if(document.getElementById("selectif2").selectedIndex == 2) txt2 = "EVNE"; 
            if(document.getElementById("selectif2").selectedIndex == 3) txt2 = "EVI";
            if(document.getElementById("selectif2").selectedIndex == 4) txt2 = "EVNI"; 
            txt2 += del + document.getElementById("ets").innerText  + del + document.getElementById("attribute").value + del + document.getElementById("value").value  + del + document.getElementById("selectif3").selectedIndex;
    }
    if(select == 3) 
    {
            if(!check(3)) return;
            txt += "Page "+  document.getElementById("selectif2").options[document.getElementById("selectif2").selectedIndex].innerText + " [" + document.getElementById("value").value + "] Then " +  document.getElementById("selectif3").options[document.getElementById("selectif3").selectedIndex].innerText;
            if(document.getElementById("selectif2").selectedIndex == 1) txt2 = "PC";
            if(document.getElementById("selectif2").selectedIndex == 2) txt2 = "PNC";
            txt2 += del + document.getElementById("value").value  + del + document.getElementById("selectif3").selectedIndex;
        
    }
    recordobject = false;
    updateworkflow(txt,txt2);
    document.getElementById("selectif").options[0].selected = true;
    refreshif();
    
}


function refreshif()
{
            var select = document.getElementById("selectif").selectedIndex;
            var data;
            
            if(select == 0) data = "<br><br><br><br><br>";
            else
            {
            recordobject = true;
            if(select == 1)
            {

             data = '<p id="ets">No element selected yet : click any element of the page below to select it</p>' + createselect("selectif2",null,["Choose option","exist","doesnt exist"]) + '<br>Then ' + createselect("selectif3",null,["Choose option","OK","NOK"]);
            }
            
            if(select == 2)
            {

            data = '<p id="ets">No element selected yet : click any element of the page below to select it</p>' + createinput("attribute") + createselect("selectif2",null,["Choose option","equals","not equals","contains","not contains"]) + createinput("value") + '<br>Then ' + createselect("selectif3",null,["Choose option","OK","NOK"]);
            }
            
            if(select == 3)
            {
                
                 data = createselect("selectif2",null,["Choose option","contains","not contains"]) + createinput("value") + '<br>Then ' + createselect("selectif3",null,["Choose option","OK","NOK"]) + "<br><br>";
            }
            data += '<button onclick="add()">Add</button>';
            }
            document.getElementById("dynif").innerHTML = data;
    
}


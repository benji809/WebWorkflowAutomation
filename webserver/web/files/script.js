function deletewf(id)
{
            if(!confirm("Sure you want to delete it ?")) return;
            
             fetch("?dest=web&action=deletewf&key=" + id)
                              .then((response) => {
                      return response.text();
                    })
                    .then((data) => {
                        if(data == "OK") location.reload();
                    });
}

function togglewf(id)
{
            if(!confirm("Sure you want to toggle it ?")) return;
             fetch("?dest=web&action=togglewf&key=" + id)
                              .then((response) => {
                      return response.text();
                    })
                    .then((data) => {
                        if(data == "OK") location.reload();
                    });
}

function deploy(id)
{
    var el = document.getElementsByName("wf" + id);
    for(var i=0;i<el.length;i++) 
    {
    if(el[i].style.display == "") el[i].style.display = "none";
    else el[i].style.display = "";
    }
    var mainel = document.getElementsByName("mainwf" + id)[0];
    if(mainel.innerHTML == "<b>+</b>") mainel.innerHTML = "<b>-</b>";
    else mainel.innerHTML = "<b>+</b>";
}

function toLocalISOString(date) {
  const localDate = new Date(date - date.getTimezoneOffset() * 60000); //offset in milliseconds. Credit https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset

  // Optionally remove second/millisecond if needed
  localDate.setSeconds(null);
  localDate.setMilliseconds(null);
  return localDate.toISOString().slice(0, -1);
}

function showhide()
{
    document.getElementsByName("meeting-time")[0].value = toLocalISOString(new Date());
    var el = document.getElementsByName("startm")[0].selectedIndex;
    var div = document.getElementById("dyndiv");
    if(el == 2) 
    {
    div.style.visibility = "hidden";
    document.getElementsByName("meeting-time")[0].required = false;
    document.getElementsByName("every")[0].required = false;
    }
    if(el == 1) 
    {
    div.style.visibility = "";
    document.getElementsByName("meeting-time")[0].required = true;
    document.getElementsByName("every")[0].required = true;
    }
    
    
    
}

async function strHash(message){
  const msgUint8 = new TextEncoder().encode(message); // encode comme (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // fait le condensé
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convertit le buffer en tableau d'octet
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convertit le tableau en chaîne hexadélimale
  return hashHex;
}


function checkpassword()
{
    if(document.getElementById("password1").value != document.getElementById("password2").value) {alert("Password are not the same, please check");return false;}
    if(document.getElementById("password1").value.length < 8 || document.getElementById("password1").value.length > 20) {alert("Password length must be between 8 and 20 characters");return false;}
    return true;
}

async function changepassword()
{
   
   if(!checkpassword()) return;
    var password = await strHash(document.getElementById("password1").value);
    var key = document.getElementById("key").value;
    
          fetch("https://www.bestautomation.me/workflow/?action=changepassword&recoverkey=" + key + "&password=" + password)
                              .then((response) => {
                      return response.text();
                    })
                    .then((data) => {
                        if(data == "OK") alert("Password updated successfully. You can now login");
                        if(data == "NOK") alert("Something is wrong, please use the last recovering email provided");
                    });
    
}

async function create()
{
    var name = document.getElementById("name").value; // WF NAME
    var url = document.getElementById("url").value; // URL
    var sendm = document.getElementById("sendm").value; // SEND EMAIL
    var startm = document.getElementById("startm").value;  // START AUTO

    var every = document.getElementById("every").value; // launch every
    var time= document.getElementById("meeting-time").value;
    var captcha = document.getElementById("captcha").value;
    //var date = new Date(time).toLocaleString("en-US", {timeZone: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris"})

    if(name == "" || url == "" || sendm == "" || startm == "" || (startm == "1" && dyndiv == "") || captcha == "") return;

    // starting studio session

    var rep = await fetch("?dest=emulator&action=createsession&url=" + url + "&sendm=" + sendm + "&startm=" + startm + "&every=" + every + "&captcha=" + captcha );
    var id = await rep.text();
    if(id.startsWith("OK")) {
            id = id.substring(2);
            window.location.replace("?dest=web&action=studio&url=" + url+ "&id=" + id + "&name=" + name + "&sendemail=" + sendm + "&selectlaunch=" + startm + "&every=" + every + "&meeting-time=" + time);

           // var array_out = [urlParams.get('name'),urlParams.get('selectlaunch'),urlParams.get('every'),urlParams.get('meeting-time'),wf,urlParams.get('sendemail')];
                
    }
    else if(id == "MR") alert("You have reached the maximum of workflow created. Consider changing subscription!");
    else if(id == "CNC") alert("Captcha is not correct");
    else if(id == "SENDMNA") alert("You cannot send mail in this mode");
    else if(id == "STARTMNA") alert("You cannot start workflow automatically in this mode");
    else if(id == "STARTEVERYNA") alert("You cannot choose this every in this mode");
    else alert("Ohohhoh, we encountered a problem on the server, sorry for that!");






}

async function login()
{
    var email = document.getElementById("email").value;
    var password = await strHash(document.getElementById("password").value);

    var rep = await fetch("?dest=web&action=dologin&email=" + email + "&password=" + password)
    var data = await rep.text();
    if(data == "NA") alert("Not activated yet. Please follow the link in the mail");
    if(data == "OK") document.location ="?dest=web&action=getwf";
    if(data == "NOK") alert("Wrong email or password. Try again");  
}

async function register()
{
    
    if(!checkpassword()) return;
    
    var password = await strHash(document.getElementById("password1").value);
    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
    var email = document.getElementById("email").value;
    var job = document.getElementById("job").value;
    var company = document.getElementById("company").value;
    var how= document.getElementById("how").value;
    var country = document.getElementById("country").value;
    
      fetch("?dest=web&action=doregister&password=" + password + "&fname=" + fname + "&lname=" + lname + "&email=" + email + "&job=" + job + "&company=" + company + "&how=" + how + "&country=" + country)
                              .then((response) => {
                      return response.text();
                    })
                    .then((data) => {
                        console.log(data);
                        if(data == "OK") alert("account created");
                        if(data == "EAE") alert("email alreadt exist");
                        // if(data == "NLI") alert("name looks incorrect");
                         if(data == "NOK") alert("unknown error");
                    });
    
    
}

function recover()
{
    var email = document.getElementById("email").value;

    fetch("https://www.bestautomation.me/workflow/?action=dorecover&email=" + email)
                              .then((response) => {
                      return response.text();
                    })
                    .then((data) => {
                        if(data == "OK") alert("If an account with this email exist, you will received soon an email to recover it");
                    });
    
    
}

function erase(el)
{
    if(el.style.color=="rgb(211, 211, 211)")
    {
        
        el.value = "";
        el.style.color = "black";
        
        
    }
    
    
}

setTimeout(checkbrowser,300);

function checkbrowser()
{
    if (detectMob()) gomobile();
    
}

function detectMob() {
  
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function createborderdiv()
{
    var border = document.createElement('div');
    border.style.width = "8%";
    border.style.height = "100%";
    return border;
}


function createhborder()
{
    var border = document.createElement('div');
    border.style = "background-color: gray;margin-top: -1px; padding-top: 1px";
    border.style.width = "100%";
    border.style.height = "2%";
    return border;
}

function gomobile()
{
    var content = document.getElementsByClassName("content")[0];
    var copyrights = document.getElementsByClassName("copyrights")[0];
    var cup = document.getElementById("cup");
    
    document.body.innerHTML = '';
    
    var maindiv = document.createElement('div');
    document.body.appendChild(maindiv);
    
    maindiv.appendChild(createhborder());
    
    var div = document.createElement('div');
    div.style = "background-color: gray;";
    div.style.width = "100%";
    div.style.height = "6%";
    div.style.display = "flex";
    div.style.flexDirection = "row;";
    div.style.justifyContent = "center;";
    
    
    const menu = [["image/accueil.png","?"], ["image/demo.png","?mode=demo"], ["image/bitcoin.png","?mode=pricing"], ["image/question.png","?mode=qa"], ["image/lock.png","?mode=lr"]];
    
    
     
    div.appendChild(createborderdiv());

    for(var i=0;i<menu.length;i++)
    {
    
    var ah = document.createElement('a');
    ah.href = menu[i][1];
    ah.style.width = "12%";
    ah.style.height = "100%";

    var div2 = document.createElement('div');
    div2.style.width = "100%";
    div2.style.height = "100%";
    div2.href = menu[i][1];
    
    var img = document.createElement('img');
    img.src = menu[i][0];
    img.style.width = "100%";
    img.style.height = "100%";
    div2.appendChild(img);
    ah.appendChild(div2);
    
    div.appendChild(ah);
    
    // create border 
    if(i >= 0 && i < menu.length- 1) div.appendChild(createborderdiv());
    }
    

    div.appendChild(createborderdiv());


    maindiv.appendChild(div);
    
    maindiv.appendChild(createhborder());
    
    content.style.top = "8%";
    content.style.left = "0";
    content.style.width = "98%";
    content.style.height = "85%";
    
    content.style.fontSize = "4.5vmin";
    
    maindiv.appendChild(content);
    
    copyrights.style.left = "0";
    copyrights.style.width = "100%";
    copyrights.style.height = "5%";
    
    maindiv.appendChild(copyrights);
    
    maindiv.appendChild(cup);
    
    var els = document.getElementsByTagName("td");
    
    for(var i=0;i<els.length;i++) els[i].style.fontSize = "4vmin";
    
       
    els = document.getElementsByTagName("input");
    
    for(var i=0;i<els.length;i++) els[i].style.fontSize = "4.5vmin";
    
       
    
  
    
}
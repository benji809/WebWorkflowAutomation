const baseurl = "?dest=emulator&action=";
var x = 0,y = 0,dy = 0;
var oldx = 0;
var oldy = 0;
var timeoutvideo;

function refreshsize()
{
    document.getElementById("img").width = window.innerWidth;
    document.getElementById("img").height = window.innerHeight * 0.86;

    document.getElementById("workflowdiv").style.width = window.innerWidth;
    document.getElementById("workflowdiv").style.height = window.innerHeight * 0.2;

}

setInterval(function update(){
    if(x != 0 || y !=0)
    {
    fetch(baseurl + "move&x=" + x + "&y=" + y);
    x = 0;
    y = 0;
    }
    if(dy != 0)
    {
    fetch(baseurl + "scroll&dy=" + dy);
    dy = 0;   
    }

},500);

function refresh(data)
{

    var divimage = document.getElementById("img")
    divimage.src = 'data:image/png;base64,' + data;
    clearTimeout(timeoutvideo);
    timeoutvideo = setTimeout(() => {
        
        alert("You have been disconnected from the server because of an inactivity or connection loss.");
        window.location.href = "?dest=web&action=getwf";


    }, 5000);

}

function stream(urlvideo)
{

fetch(urlvideo)
    .then(response => {
        // Get the readable stream from the response body
        const stream = response.body;
        // Get the reader from the stream
        const reader = stream.getReader();
        // Define a function to read each chunk
        
        var data;
        
        const readChunk = () => {
            // Read a chunk from the reader
            reader.read()
                .then(({
                    value,
                    done
                }) => {
                    // Check if the stream is done
                    if (done) {
                        // Log a message
                        console.log('Stream finished');
                        // Return from the function
                        return;
                    }
                    // Convert the chunk value to a string
                    var chunkString = new TextDecoder().decode(value);
                    
                     //console.log(chunkString);
                    
                    
                     if(chunkString.includes("MES##")) // nettoyage message
                     {
                     var message = chunkString.substring(chunkString.indexOf("MES##")+5);
                     var infos = JSON.parse(message);
                     infos.map((x) => listenMessage(x));
                     }

                    
                     if(chunkString.startsWith("BEG##") && chunkString.endsWith("END##")) 
                     {
                        data = chunkString.substring(5,chunkString.length-5);
                        refresh(data);
                     }
                     
                     if(chunkString.startsWith("BEG##") && !chunkString.endsWith("END##"))
                     {
                        data = chunkString.substring(5);
                     }
                     
                     if(!chunkString.startsWith("BEG##") && chunkString.endsWith("END##"))
                     {
                        data += chunkString.substring(0,chunkString.length-5);
                        refresh(data);
                     }
                     
                     if(!chunkString.startsWith("BEG##") && !chunkString.endsWith("END##"))
                     {
                        data += chunkString;
                     }
                     
                     
                     
                     
                     
                     
                     

                    readChunk();
                })
                .catch(error => {
                    // Log the error
                    console.error(error);
                });
        };
        // Start reading the first chunk
        readChunk();
    })
    .catch(error => {
        // Log the error
        console.error(error);
    });
}



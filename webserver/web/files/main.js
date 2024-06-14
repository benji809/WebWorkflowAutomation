const baseurl = "?dest=emulator&id=" + id + "&action=";
var x,y,dy = 0;

setInterval(function update(){
    if(x != 0 || y !=0)
    {
    fetch(baseurl + "move&x=" + parseInt(x) + "&y=" + parseInt(y));
    x = 0;
    y = 0;
    }
    if(dy != 0)
    {
    fetch(baseurl + "scroll&dy=" + parseInt(dy));
    dy = 0;   
    }

},500);

   

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
                    
                    
                     if(chunkString.includes("MES##")) // nettoyage
                     {
                     var message = chunkString.substring(chunkString.indexOf("MES##")+5);
                     console.log(message);
                     var infos = JSON.parse(message);
                     infos.map((x) => listenMessage(x));
                     }
                     
                    
                     if(chunkString.startsWith("BEG##") && chunkString.endsWith("END##")) 
                     {
                        data = chunkString.substring(5,chunkString.length-5);
                        var image = document.getElementById("img")
                        image.src = 'data:image/jpeg;base64,' + data;
                     }
                     
                     if(chunkString.startsWith("BEG##") && !chunkString.endsWith("END##"))
                     {
                        data = chunkString.substring(5);
                     }
                     
                     if(!chunkString.startsWith("BEG##") && chunkString.endsWith("END##"))
                     {
                        data += chunkString.substring(0,chunkString.length-5);
                        var image = document.getElementById("img")
                    image.src = 'data:image/png;base64,' + data;
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



var grab = false;
function animateimg()
{        
        
        var div = document.getElementById('img');
        div.addEventListener('mousedown', mousedown);
        div.addEventListener('mouseup', mouseup);
        div.addEventListener('mousemove', mousemove);

 
        var rect = {
            x0: 0,
            y0: 0,
            x1: 0,
            y1: 0
        };

        function mousedown(e) {
            if(screenshot)
            {
                document.getElementById("screenshot").src="?dest=web&action=getfile&file=question.jpg";
                grab = true;
                rect.x0 = e.clientX;
                rect.y0 = e.clientY;
            }

        }

        function mousemove(e) {
            if (grab && screenshot) {
                rect.x1 = e.clientX;
                rect.y1 = e.clientY;
                showRect();
            }
        }

        function mouseup(e) {
            if (grab && screenshot) {
                grab = false;
                var el = document.getElementById("screenshot");
                var img = document.getElementById("img");
                el.xdef = (rect.x0-e.currentTarget.offsetLeft)/img.width;
                el.ydef = (rect.y0-e.currentTarget.offsetTop)/img.height;
                el.wdef = (rect.x1 - rect.x0)/img.width;
                el.hdef = (rect.y1 - rect.y0)/img.height;
                  
                fetch(baseurl + "screenshot&x=" + el.xdef  + "&y=" +  el.ydef + "&w=" +  el.wdef + "&h=" + el.hdef);
             }


        }

        function showRect() {
            var rectDiv = document.getElementById('rect');
            rectDiv.style.display = 'block';
            rectDiv.style.position = 'absolute';
            rectDiv.style.left = rect.x0 + 'px';
            rectDiv.style.top = rect.y0 + 'px';
            rectDiv.style.width = (rect.x1 - rect.x0) + 'px';
            rectDiv.style.height = (rect.y1 - rect.y0) + 'px';

          //  var boundsDiv = document.getElementById('bounds');
           // boundsDiv.innerText = 'crop rect: ' + rect.x0 + ',' + rect.y0 + ' to ' + rect.x1 + ',' + rect.y0;
        }

}
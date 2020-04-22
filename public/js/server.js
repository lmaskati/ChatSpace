$(document).ready(function(){

    //setInterval(getStuff, 2000);

    getStuff()

    });


		function getStuff(){
        $.get('/', function(allData, status){
            //console.log("data" + JSON.stringify(allData));
         //console.log(JSON.stringify(allData))

        // you might want to add callback function that is executed post request success
    });
    }

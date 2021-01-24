 
$(document).ready(function(){

    $("#searchBtn").on("click", function(){

        var searchVal = $("#input").val();
        var name = searchVal;

        //clear input box
        $("#input").val();

        // here when we get the input value we search for weather
        weatherSearch(searchVal);
        listIRow(searchVal);
        addNewCity(name);
               
    });


    //Saving the search value to local storage
    var addNewCity = function (name) {
        // retrieve it (Or create a blank array if there isn't any info saved yet),
        var cities = JSON.parse(localStorage.getItem('cities')) || [];
        // add to it,
        cities.push({name: name});
        // then put it back.
        localStorage.setItem('cities', JSON.stringify(cities));
    };

     
    //Here when the user click
    $("#historyList").on("click", "li", function(){

        for (var i = 0; i < history.length; i++) {
          listIRow(history[i]);
      }
        weatherSearch($(this).text());
        
    });


    // here create list item for search history
    function listIRow(searchVal) {

        var li = $("<li>").addClass("list-group-item list-group-item action").text(searchVal);
        $("#historyList").append(li);
    };

     $("#historyList").val(localStorage.getItem("cities"));

    // Function for getting the uv index
    function getUVIndex(lat, lon){

        var apiKey ="60bba450f0b4f2e8daf5946dfecd1ed4";
        
        var result; 
    
       var url = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url,
            success: function(response) {
               result = response.value;
    
               var uv =  $("<p>").addClass("card-text").text('UV Index Value:' );
               var btn = $("<span>").addClass("btn btn-sm").text(result);
    
                if(result < 3) {
    
                    btn.addClass("btn-success");
    
                } else if(result < 6 ){
    
                    btn.addClass("btn-warning");
    
                } else{
    
                    btn.addClass("btn-danger");
                }
             
                $("#today .card-body").append(uv.append(btn));
                
            }
        });
        
    };


    // Function for getting the current weather
   function weatherSearch(searchVal) {

        var apiKey ="60bba450f0b4f2e8daf5946dfecd1ed4";
        var URL =`https://api.openweathermap.org/data/2.5/weather?q=${searchVal}&appid=${apiKey}&units=imperial`;

        $.ajax({
            type: "GET",
            url: URL,
            dataType: "json",
            success: function(response) {
                console.log(response);
                
                // clear input area
                $("#today").empty();
    
                var card = $("<div>").addClass("card");
                var title = $("<h2>").addClass("card-title").text(response.name + "(" + new Date().toLocaleDateString() + ")");
                var body = $("<div>").addClass("card-body");
                var temp = $("<p>").addClass("card-text").text("Temperature: " + response.main.temp + "°F");
                var humid = $("<p>").addClass("card-text").text("Humidity: " + response.main.humidity + "%");
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + response.wind.speed + "MPH");
                var img = $("<img>").attr("src", "https://api.openweathermap.org/img/w/" + response.weather[0].icon + ".png");
        
                
                body.append(title, img, temp, wind, humid);
                card.append(body);
                $("#today").append(card);

                getUVIndex(response.coord.lat, response.coord.lon);
                getFiveDayForecast(searchVal);
                
                 
            }
        });
        
    };
   

  
    
    //Function to get the 5-day forcast weather
    function getFiveDayForecast(searchVal){

        //var apiKey ="60bba450f0b4f2e8daf5946dfecd1ed4";
        var URL2 = `https://api.openweathermap.org/data/2.5/forecast?q=${searchVal}&appid=60bba450f0b4f2e8daf5946dfecd1ed4&units=imperial`;

        $.ajax({
            type: "GET",
            url: URL2,
            dataType: "json",
            success:function(response){
               console.log(response);
               
               $("#h2").text("5-Day-Forecast:");

               //empty method prevent from over riding
               $("#future").empty();
                
               //looping to get the 5 day forcast
                for(var i = 5; i < response.list.length; i=i+8){
                    
                    var card = $("<div>").addClass("card bg-primary text-white");
                    var body = $("<div>").addClass("card-body");
                    var title = $("<h5>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString());
                    var img = $("<img>").attr("src", "https://api.openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    var humid = $("<p>").addClass("card-text").text("Humidity: " + response.list[i].main.humidity + "%");
                    var temp = $("<p>").addClass("card-text").text("Temperature: " + response.list[i].main.temp + "°F");
            
                    body.append(title, img, temp, humid);
                    card.append(body);
                    $("#future").append(card);
                   
                }
                 
            }
        });
    };

});
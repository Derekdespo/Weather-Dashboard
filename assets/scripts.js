// The function that will hold all of the dynamic content of the page
function initialize() {
    // Establish variables that will hook elements from the HTML file
    // Hook to yourCity id an the input element
    const inputCityEl = document.getElementById("yourCity");
    // Hook to the search button id searchBtn
    const searchButtonEl = document.getElementById("searchBtn");
    // Hook to the button that will serve to clear through id clearSearch
    const clearButtonEl = document.getElementById("clearSearch");
    // Hook to the element that will hold the inputted city name with id cityN
    const cityNamEl = document.getElementById("cityN");
    // Hook to the corresponding img that goes with the name using id thisPhoto
    const thisPhotoEl = document.getElementById("thisPhoto");
    // Hook to the h6 tag for temperature using id temp
    const tempEl = document.getElementById("temp");
    // Hook to h6 tag representing humidity using id humid
    const humidityEl = document.getElementById("humid");
    // Hook to the h6 tag the represents wind mph using id wind
    const windEl = document.getElementById("wind");
    // Hook into the h6 tag representing the uv index using id UVI
    const UVIEl = document.getElementById("UVI");
    // Hook into the form element with id history
    const historyFormEl = document.getElementById("history");

    // Creating a variable for the key since we may need to use it more than once and typing it all out is long and annoying
    const key = "5ea9f8741d3c23988ae50f314b36e9e8";

    // creating a function that will get the weather information based on city name 
    function selectedCity(cityName) {
        // need to run ajax method in order to pull from the weather data-base
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + key;
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);
                // Need to get the date so that it can display next to the city name on the page
                // Method to get the date
                // Set variable for the present day
                const present = new Date(response.data.dt * 1000);
                console.log(present);
                // will represent the current day
                const presentDay = present.getDate();
                // will represent the integer for the month
                const presentMonth = present.getMonth();
                // will represent the integer for the year
                const presentYear = present.getUTCFullYear();
                // printing the city name as well as the date in the variable hooked to the id cityN
                cityNameEL.text(response.data.name + " month " + "/" + " day " + "/" + " year ");
                // getting the image that represents the present weather
                var wImg = response.data.weather[0].icon;
                // adding attributes to the image so that it has a source and an alt attribute
                thisPhotoEl.attr("src", "https://openweathermap.org/img/wn/" + wImg + "@2x.png");
                thisPhotoEl.attr("alt", response.data.weather[0].description);
                // setting up the text that will fall in the temp element
                tempEl.text("Temp: " + response.data.main.temp + "K");
                // setting up the text that with go in the humid elemnt
                humidityEl.text("Humidity: " + response.data.main.humidity + "%");
                // setting up the text that will fall in the Wind element
                windEl.text("Wind: " + response.data.wind.speed + "mph");
                // set up a variable for latitude and longitude to calculate the UV index
                var latitude = response.data.coord.lat;
                var longitude = response.data.coord.lon;
                // now set up the uv index using lat and lon
                var uvQuery = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + key + "&cnt=1";
                // ajax call
                $.ajax({
                    url: uvQuery,
                    method: "GET"
                })
                    .then(function (response) {
                        // creates the element that will store the index results
                        var uv = $("<span>");
                        // creates a button style look for the uv index
                        uv.attr("class", "btn btn-danger");
                        // prints the response data to the new element
                        uv.text(response.data[0].value);
                        // creates text for the UV element on the html
                        UVIEl.text("UV Index: ");
                        // appends (adds) the uv text content into the UVI element
                        UVIEl.append(uv);
                    });
                    // Next need to set up the weeks forecast
                    // set a variable for the inputted city
                    var thisCity = response.data.id;
                    var forecastQuery = "https://api.openweathermap.org/data/2.5/forecast?id=" + thisCity + "&appid=" + key;
                    // ajax call
                    $.ajax({
                        url: forecastQuery,
                        method: "GET"
                    })
                    .then(function(response) {
                        console.log(response);
                        // a variable that ties into all forecast boxes
                        const fCEl = document.querySelectorAll(".fC");
                        // for loop to apply the following to the forecast boxes
                        for (i=0; i < fCEl.length; i++) {
                            fCEl[i].text("");
                            fcIndex = (i*8) + 4;
                            // similar to above, need to get the date
                            // this time the date will be for weekly forecast 
                            const fcDate = new Date(response.data.list[fcIndex].dt * 1000);
                            const fcDay = fcDate.getDate();
                            const fcMonth = fcDate.getMonth();
                            const fcYear = fcDate.getFullYear();
                            const fcLine = $("<p>");
                            fcLine.text(fcMonth + "/" + fcDay + "/" + fcYear);
                            fCEl[i].append(fcLine);
                            // need to create a new element for the img icon for weather
                            const fcwImg = $("<img>");
                            // set attributes for the image
                            fcwImg.attr("src", "https://openweathermap.org/img/wn/" + response.data.list[fcIndex].weather[0].icon + "@2x.png");
                            fcwImg.attr("alt", response.data.list[fcIndex].weather[0].description);
                            // append the forecasts to their respective locations
                            fCEl[i].append(fcwImg);
                            // variable for temperature
                            const fcTemp = $("<p>");
                            fcTemp.text("Temp: " + response.data.list[fcIndex].main.temp + "K");
                            fCEl[i].append(fcTemp);
                            // variable for humidity
                            const fcHumid = $("<p>");
                            fcHumid.text("Humidity " + response.data.list[fcIndex].main.humidity + "%")
                            fCEl[i].append(fcHumid);
                        }
                    });
  });
    }

        // add a click event to the searchBtn
        searchButtonEl.addEventListener("click", function() {
            // variable for the input value
            
            selectedCity(inputCityEl.val());
        })
}
initialize();
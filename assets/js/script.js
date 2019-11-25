var previousCitySearches = [];
var currentCitySearch = "";

var cityUserInput = $("#city-input");
var cityInputButton = $("#city-input-button");
var cityTodaysHumidity = $("#todays-humidity")
var cityTodaysTemperature = $("#todays-temperature")
var cityTodaysWindSpeed = $("#todays-wind-speed")
var cityTodaysUvIndex = $("#todays-uv-index")
var dayOneDisplayDiv = $("#day-one-display")
var dayTwoDisplayDiv = $("#day-two-display")
var dayThreeDisplayDiv = $("#day-three-display")
var dayFourDisplayDiv = $("#day-four-display")
var dayFiveDisplayDiv = $("#day-five-display")
var mainCityInfoDiv = $("#main-city-info")
var previousCitySearchesDiv = $("#previous-searches")
var firstScreenLoadDiv = $("#first-screen-load")
var weatherAfterSearchDiv = $("#weather-after-search")

// this is the URL that needs to be used at the beginning of every icon query. need to finish the query with @2x.png every time, too
var baseIconURL = "https://openweathermap.org/img/wn/"
var baseIconURLsuffix = "@2x.png"

// Write Functions Here

// writing a clearDailyForecast function to run inside the PresentTodaysWeather function so that it clears out the previous search's info

function clearDailyForecast() {
   dayOneDisplayDiv.empty();
   dayTwoDisplayDiv.empty();
   dayThreeDisplayDiv.empty();
   dayFourDisplayDiv.empty();
   dayFiveDisplayDiv.empty();
   mainCityInfoDiv.empty();


};

function getPreviousCities() {
   // call local storage getPreviousCities
   // assign previous cities to previousCitySearches
   previousCitySearches = JSON.parse(localStorage.getItem("city"))

   // if localstorage is empty, leave this function
   if (previousCitySearches === null) {
      return
   }

   // reversing the order so that the previous searches section is reverse order (so most recent at the top)
   previousCitySearches = previousCitySearches.reverse();

   previousCitySearchesDiv.empty();

   // loop through the array
   for (var i = 0; i < previousCitySearches.length; i++) {

      // create a div with the innerHTML being the name of the city
      var newPreviousCityDiv = $("<div>");
      newPreviousCityDiv = newPreviousCityDiv.attr("class", "previous-searches-button")
      newPreviousCityDiv.html(previousCitySearches[i])

      // append that button to the section
      previousCitySearchesDiv.append(newPreviousCityDiv);

   }
};

function callWeatherData(event) {
   event.preventDefault();
   clearDailyForecast();

   // getting the text from the button
   var thisButtonsCity = $(this).text();
   todaysWeather(thisButtonsCity);
};

function storeData(event) {
   event.preventDefault();

   currentCitySearch = cityUserInput.val();

   if (currentCitySearch === "") {
      alert("Please put in a valid city")
      return
   }

   previousCitySearches.push(currentCitySearch);

   localStorage.setItem("city", JSON.stringify(previousCitySearches))

};

function todaysWeather(cityName) {
   var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
   var uviURL = "https://api.openweathermap.org/data/2.5/uvi?"
   var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?"
   // var userInput = cityUserInput.val() + "&";
   var apiKey = "appid=3c98be5119ec5cf431d72d940860a3bc";
   var queryURL = weatherURL + cityName + "&" + apiKey;
   var lat = "";
   var long = "";
   var cityID = "";
   var cityNameText = "";

   if (cityName === undefined) {
      firstScreenLoadDiv.css("display", "block");
      weatherAfterSearchDiv.css("display", "none");
      return;
   } else {
      firstScreenLoadDiv.css("display", "none");
      weatherAfterSearchDiv.css("display", "block");

   }

   // this call sets the weather data for today
   $.ajax({
      url: queryURL,
      method: "GET"
   }).then(
      function (response) {
         // converting temperature from kelvin to fahrenheit
         var tempF = (response.main.temp - 273.15) * 1.80 + 32;

         // attaching temperature to text
         cityTodaysTemperature.text("Temperature: " + tempF.toFixed(2))

         // attaching humidity to text
         cityTodaysHumidity.text("Humidity: " + response.main.humidity + "%")

         //attaching wind speed
         cityTodaysWindSpeed.text("Wind speed: " + response.wind.speed)

         // assigning lat and long for the UV Index
         lat = "&lat=" + response.coord.lat;
         long = "&lon=" + response.coord.lon;
         cityID = "&id=" + response.id;

         // getting city name
         cityNameText = response.name;

         // get and setting today's date
         var todaysDate = new Date(response.dt * 1000);
         var todaysMonth = todaysDate.getMonth();
         var todaysDay = todaysDate.getDay();
         var todaysYear = todaysDate.getFullYear();

         var formattedToday = cityNameText + " (" + todaysMonth + "/" + todaysDay + "/" + todaysYear + ")";

         var todaysIcon = response.weather[0].icon;
         var todaysIconURL = baseIconURL + todaysIcon + baseIconURLsuffix;

         var todaysIconElement = $("<img>")
         todaysIconElement.attr("src", todaysIconURL)
         todaysIconElement.attr("class", "todays-icon")

         $("#main-city-info").append(formattedToday)
         $("#main-city-info").append(todaysIconElement)







      })

   // this sets the uv index for today. it was a seperate API for this so I set it up seperately. i set a timeout because I was not able to populate my completeuviurl quickly enough with the lon and lat, but this delay allowed it enough time to populate. i couldn't think of another way to get the long/lat
   setTimeout(function () {
      var completeUviURL = uviURL + apiKey + lat + long;
      $.ajax({
         url: completeUviURL,
         method: "GET"
      }).then(
         function (response) {
            cityTodaysUvIndex.text("UV Index: " + response.value);
         }
      )
   }, 500);

   // this call sets the weather data for five-day forecast
   setTimeout(function () {
      var completeIdURL = fiveDayURL + apiKey + cityID;
      $.ajax({
         url: completeIdURL,
         method: "GET"
      }).then(
         function (response) {
            // defining all the dates here. I'm takinga UNIX code, multiplying that number by 1000 to get milliseconds instead of seconds, then using JavaScript date functions to get the data I need.
            var date1 = new Date(response.list[3].dt * 1000);
            var date2 = new Date(response.list[11].dt * 1000);
            var date3 = new Date(response.list[19].dt * 1000);
            var date4 = new Date(response.list[27].dt * 1000);
            var date5 = new Date(response.list[35].dt * 1000);

            // devining all the months here
            var month1 = date1.getMonth();
            var month2 = date2.getMonth();
            var month3 = date3.getMonth();
            var month4 = date4.getMonth();
            var month5 = date5.getMonth();

            // defining all the days
            var day1 = date1.getDay();
            var day2 = date2.getDay();
            var day3 = date3.getDay();
            var day4 = date4.getDay();
            var day5 = date5.getDay();

            // defining all the years
            var year = date1.getFullYear();

            // formatting all the dates
            var formattedDate1 = month1 + "/" + day1 + "/" + year;
            var formattedDate2 = month2 + "/" + day2 + "/" + year;
            var formattedDate3 = month3 + "/" + day3 + "/" + year;
            var formattedDate4 = month4 + "/" + day4 + "/" + year;
            var formattedDate5 = month5 + "/" + day5 + "/" + year;

            // get icon sfor weather
            var icon1 = response.list[3].weather[0].icon;
            var icon2 = response.list[11].weather[0].icon;
            var icon3 = response.list[19].weather[0].icon;
            var icon4 = response.list[27].weather[0].icon;
            var icon5 = response.list[35].weather[0].icon;

            // setting the URLs
            var icon1URL = baseIconURL + icon1 + "@2x.png"
            var icon2URL = baseIconURL + icon2 + "@2x.png"
            var icon3URL = baseIconURL + icon3 + "@2x.png"
            var icon4URL = baseIconURL + icon4 + "@2x.png"
            var icon5URL = baseIconURL + icon5 + "@2x.png"

            // creating image elements with the source
            var img1Element = $("<img>").attr("src", icon1URL);
            var img2Element = $("<img>").attr("src", icon2URL);
            var img3Element = $("<img>").attr("src", icon3URL);
            var img4Element = $("<img>").attr("src", icon4URL);
            var img5Element = $("<img>").attr("src", icon5URL);

            // get temperature and convert to fahrenheit
            var tempF1 = Math.round((response.list[3].main.temp - 273.15) * 1.80 + 32);
            var tempF2 = Math.round((response.list[11].main.temp - 273.15) * 1.80 + 32);
            var tempF3 = Math.round((response.list[19].main.temp - 273.15) * 1.80 + 32);
            var tempF4 = Math.round((response.list[27].main.temp - 273.15) * 1.80 + 32);
            var tempF5 = Math.round((response.list[35].main.temp - 273.15) * 1.80 + 32);

            // get humidity
            var humidity1 = response.list[3].main.humidity;
            var humidity2 = response.list[11].main.humidity;
            var humidity3 = response.list[19].main.humidity;
            var humidity4 = response.list[27].main.humidity;
            var humidity5 = response.list[35].main.humidity;

            // append dates  to the cards
            dayOneDisplayDiv.append(formattedDate1 + "<br>");
            dayTwoDisplayDiv.append(formattedDate2 + "<br>");
            dayThreeDisplayDiv.append(formattedDate3 + "<br>");
            dayFourDisplayDiv.append(formattedDate4 + "<br>");
            dayFiveDisplayDiv.append(formattedDate5 + "<br>");

            // append images to the cards
            dayOneDisplayDiv.append(img1Element);
            dayTwoDisplayDiv.append(img2Element);
            dayThreeDisplayDiv.append(img3Element);
            dayFourDisplayDiv.append(img4Element);
            dayFiveDisplayDiv.append(img5Element);

            // append temperatures to the cards
            dayOneDisplayDiv.append("<br>" + "Temperature: " + tempF1 + "<br>");
            dayTwoDisplayDiv.append("<br>" + "Temperature: " + tempF2 + "<br>");
            dayThreeDisplayDiv.append("<br>" + "Temperature: " + tempF3 + "<br>");
            dayFourDisplayDiv.append("<br>" + "Temperature: " + tempF4 + "<br>");
            dayFiveDisplayDiv.append("<br>" + "Temperature: " + tempF5 + "<br>");

            // append humidity to the cards
            dayOneDisplayDiv.append("Humidity: " + humidity1 + "%");
            dayTwoDisplayDiv.append("Humidity: " + humidity2) + "%";
            dayThreeDisplayDiv.append("Humidity: " + humidity3) + "%";
            dayFourDisplayDiv.append("Humidity: " + humidity4) + "%";
            dayFiveDisplayDiv.append("Humidity: " + humidity5) + "%";



         }
      )
   }, 500);


};

function presentTodaysWeatherData(event) {
   event.preventDefault();

   clearDailyForecast();

   var userInput = cityUserInput.val();

   todaysWeather(userInput);

   previousCitySearches = [];
   getPreviousCities();

};

function clearSearchHistory(event) {
   event.preventDefault();

   previousCitySearches = [];

   localStorage.setItem("city", JSON.stringify(previousCitySearches))

   previousCitySearchesDiv.empty();


}

getPreviousCities();

// calling the todaysWeather function and populating my most recent
todaysWeather(previousCitySearches[0])

cityInputButton.on("click", storeData);
cityInputButton.on("click", presentTodaysWeatherData);
$(".previous-searches-button").on("click", callWeatherData);
$("#clear-button").on("click", clearSearchHistory);

// i want to create a function that clears the previous searches

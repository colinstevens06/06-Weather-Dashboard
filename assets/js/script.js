var previousCitySearches = [];
var currentCitySearch = "";

var cityUserInput = $("#city-input");
var cityInputButton = $("#city-input-button");
var cityTodaysDate = $("#todays-date")
var cityTodaysTemperature = $("#todays-temperature")
var cityTodaysWindSpeed = $("#todays-wind-speed")
var cityTodaysUvIndex = $("#todays-uv-index")
var dayOneDisplayDiv = $("#day-one-display")
var dayOneDisplayDiv = $("#day-two-display")
var dayOneDisplayDiv = $("#day-three-display")
var dayOneDisplayDiv = $("#day-four-display")
var dayOneDisplayDiv = $("#day-five-display")
var previousCitySearchesDiv = $("#previous-searches")

// Write Functions Here

function getPreviousCities() {
   // call local storage getPreviousCities
   // assign previous cities to previousCitySearches
   previousCitySearches = JSON.parse(localStorage.getItem("city"))

   console.log(previousCitySearches);

   // loop through the array
   for (var i = 0; i < previousCitySearches.length; i++) {

      // create a div with the innerHTML being the name of the city
      var newPreviousCityDiv = $("<div>");
      newPreviousCityDiv = newPreviousCityDiv.attr("class", "previous-searches-button")
      newPreviousCityDiv.html(previousCitySearches[i])
      // append that button to the section
      previousCitySearchesDiv.append(newPreviousCityDiv);

   }

// create a new function called 'callWeatherData'

// then add the onClick for the button

   /*
      new function called 'callWeatherData'

      onClick of a button (event listener) - grab that button's innerHTML (data-*, wherever it's stored) - then make that AJAX call 
   */
};

function callWeatherData(event) {
   event.preventDefault();

   var thisButtonsCity = $(this).text();
   console.log(thisButtonsCity);

   

}

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

function presentTodaysWeatherData(event) {
   event.preventDefault();

   var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
   var uviURL = "http://api.openweathermap.org/data/2.5/uvi?"
   var fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast?"
   var userInput = cityUserInput.val() + "&";
   var apiKey = "appid=3c98be5119ec5cf431d72d940860a3bc";
   var queryURL = weatherURL + userInput + apiKey;
   var lat = "";
   var long = "";
   var cityID = "";

   // this call sets the weather data for today
   $.ajax({
      url: queryURL,
      method: "GET"
   }).then(
      function (response) {

         console.log(response)

         // converting temperature from kelvin to fahrenheit
         var tempF = (response.main.temp - 273.15) * 1.80 + 32;

         // attaching content to text
         cityTodaysTemperature.text("Temperature: " + tempF.toFixed(2))
         cityTodaysWindSpeed.text("Wind speed: " + response.wind.speed)

         // assigning lat and long for the UV Index
         lat = "&lat=" + response.coord.lat;
         long = "&lon=" + response.coord.lon;
         cityID = "&id=" + response.id;

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
            console.log(response)

            // this is the URL that needs to be used at the beginning of every icon query. need to finish the query with @2x.png every time, too
            var baseIconURL = "http://openweathermap.org/img/wn/"

            // get date. I'm takinga UNIX code, multiplying that number by 1000 to get milliseconds instead of seconds, then using JavaScript date functions to get the data I need.
            var date1 = new Date(response.list[4].dt * 1000);
            var month1 = date1.getMonth();
            var day1 = date1.getDay();
            var year1 = date1.getFullYear();
            var formattedDate1 = month1 + "/" + day1 + "/" + year1;

            // get icon for weather
            var icon1 = response.list[4].weather[0].icon;
            var icon1URL = baseIconURL + icon1 + "@2x.png"

            // get temperature and convert to fahrenheit
            var tempF1 = (response.list[4].main.temp - 273.15) * 1.80 + 32;
            tempF1 = Math.round(tempF1);
            console.log(tempF1);

            // get humidity
            // var humidity1 = response.
            // append it to the card


         }
      )
   }, 500);
};

getPreviousCities();


cityInputButton.on("click", storeData);
cityInputButton.on("click", presentTodaysWeatherData);
$(".previous-searches-button").on("click", callWeatherData)

var previousCitySearches = [];
var currentCitySearch = "";

var cityUserInput = $("#city-input");
var cityInputButton = $("#city-input-button");
var cityTodaysDate = $("#todays-date")
var cityTodaysTemperature = $("#todays-temperature")
var cityTodaysWindSpeed = $("#todays-wind-speed")
var cityTodaysUvIndex = $("#todays-uv-index")

// Write Functions Here

function getPreviousCities() {

};

function storeData(event) {
   event.preventDefault();

   var userInput = cityUserInput.val();

   currentCitySearch = "";
   currentCitySearch = userInput;

   if (userInput === "") {
      alert("Please put in a valid city")
      return
   };

   previousCitySearches.push(userInput);

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
            console.log(response)
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
            
         }
      )
   }, 500);
};

cityInputButton.on("click", storeData);
cityInputButton.on("click", presentTodaysWeatherData);
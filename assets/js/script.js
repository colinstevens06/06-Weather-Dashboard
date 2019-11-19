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
   var uviURL = "https://"
   var userInput = cityUserInput.val();
   var apiKey = "&appid=3c98be5119ec5cf431d72d940860a3bc";
   var queryURL = weatherURL + userInput + apiKey;
   var uviURL = weatherURL
   var lat = "";
   var long = "";

   $.ajax({
      url: queryURL,
      method: "GET"
   }).then(
      function(response) {
         cityTodaysDate.text("NEED TO FIGURE THIS ONE OUT")

         // converting temperature from kelvin to fahrenheit
         var tempF = (response.main.temp - 273.15) * 1.80 + 32;

         cityTodaysTemperature.text("Temperature: " + tempF)
         cityTodaysWindSpeed.text("Wind speed: " + response.wind.speed)
         cityTodaysUvIndex.text("UV Index: " + response.)



      }



   )






};

cityInputButton.on("click", storeData);
cityInputButton.on("click", presentTodaysWeatherData);
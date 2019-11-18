var previousCitySearches = [];
var currentCitySearch = "";

var cityUserInput = $("#city-input");
var cityInputButton = $("#city-input-button");

console.log(cityUserInput)



// Write Functions Here

function getPreviousCities() {

};

function storeData(event) {
   event.preventDefault()
   console.log(cityUserInput)

   var userInput = cityUserInput.value;

   console.log(userInput)

   // currentCitySearch = "";
   // currentCitySearch = userInput;

   // if (userInput === "") {
   //    alert("Please put in a valid city")
   // }

   // previousCitySearches.push(userInput);

   // localStorage.setItem("city", JSON.stringify(userInput))

};

cityInputButton.on("click", storeData);
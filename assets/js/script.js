var cityUserInput = $("#city-input")
var cityInputButton = $("#city-input-button")



// Write Functions Here

function getPreviousCities() {

}

function storeData() {
   var userInput = cityUserInput.value();

   localStorage.setItem("city", userInput)

}

cityInputButton.on("click", storeData)
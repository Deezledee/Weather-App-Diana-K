// Feature #1
function todayFormatDate(date) {
  let currentHour = date.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinutes = date.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let currentDay = days[date.getDay()];
  let currentMonth = months[date.getMonth()];
  let currentDate = date.getDate();
  let formattedDate = `${currentDay}, ${currentMonth} ${currentDate}, ${currentHour}:${currentMinutes}`;
  return formattedDate;
}
let now = new Date();
let h3 = document.querySelector(".date");
h3.innerHTML = `${todayFormatDate(now)}`;

// Feature #2

function searchCity(event) {
  event.preventDefault();
  let currentCity = document.querySelector("#city-input");
  let h2 = document.querySelector("h2");
  h2.innerHTML = `Today in ${currentCity.value}`;
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

// Bonus - Feature 3
function temperatureInCelsius() {
  let temperatureCelsius = document.querySelector(".today-temperature");
  temperatureCelsius.innerHTML = `5`;
}
let celsiusButton = document.querySelector("#celsius");
celsiusButton.addEventListener("click", temperatureInCelsius);

function temperatureInFahrenheit() {
  let temperatureFahrenheit = document.querySelector(".today-temperature");
  temperatureFahrenheit.innerHTML = `41`;
}
let fahrenheitButton = document.querySelector("#fahrenheit");
fahrenheitButton.addEventListener("click", temperatureInFahrenheit);

//Geolocation function - search city

function showTemperature(response) {
  let iconElement = document.querySelector("#main-icon");
  let currentTemp = document.querySelector("#temperature");
  currentTemp.innerHTML = `${Math.round(response.data.main.temp)}°C`;
  let description = document.querySelector("#today_description");
  description.innerHTML = response.data.weather[0].description;
  iconElement.innerHTML = `http://openweathermap.org/img/wn/01d@2x.png`;
  document.querySelector("h2").innerHTML = `Today in ${response.data.name}`;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
}
function searchCities(cities) {
  let apiKey = "19d4e3e019b6af8cf23d09f85fc85a54";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cities}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

function search(event) {
  event.preventDefault();
  let cities = document.querySelector("#city-input").value;
  searchCities(cities);
}

let searchCity1 = document.querySelector("#search-form");
searchCity1.addEventListener("submit", search);

//Current location button - lat & lon

let currentLocationButton = document.querySelector("#currentLocation1");
currentLocationButton.addEventListener("click", getCurrentLocation);

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function searchLocation(position) {
  let apiKey = "19d4e3e019b6af8cf23d09f85fc85a54";
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}

//API sync

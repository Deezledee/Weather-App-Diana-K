const API_KEY = process.env.OWM_API_KEY;

function todayFormatDate(timestamp) {
  let date = new Date(timestamp);
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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}
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

//Geolocation function - search city

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
      <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
      <img
        src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png"
        alt=""
        width="40"
      />
      <div class="weather-forecast-temperatures">
        <span class="weather-forecast-temperature-max"> ${Math.round(
          forecastDay.temp.max
        )}° </span>
        <span class="weather-forecast-temperature-min"> ${Math.round(
          forecastDay.temp.min
        )}° </span>
      </div>
    </div>
    
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = API_KEY;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  let iconElement = document.querySelector("#main-icon");
  let currentTemp = document.querySelector("#temperature");
  let humidityElement = document.querySelector("#humidity_number");
  let windElement = document.querySelector("#windspeed_number");
  let datelement = document.querySelector("#date");
  currentTemp.innerHTML = `${Math.round(response.data.main.temp)}°C`;
  let descriptionElement = document.querySelector("#today_description");
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  datelement.innerHTML = todayFormatDate(response.data.dt * 1000);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  celciusTemperature = response.data.main.temp;
  iconElement.setAttribute("alt", response.data.weather[0].description);
  document.querySelector("h2").innerHTML = `Today in ${response.data.name}`;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  getForecast(response.data.coord);
}

function searchCities(cities) {
  let apiKey = API_KEY;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cities}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

function search(_event) {
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

//celcius to fahrenheit

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  currentTemp.innerHTML = Math.round(fahrenheitTemperature);
}
function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let currentTemp = document.querySelector("#temperature");
  currentTemp.innerHTML = Math.round(celciusTemperature);
}

let celciusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

// Default search
searchCities("Tokyo");

function searchLocation(position) {
  let apiKey = API_KEY;
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}

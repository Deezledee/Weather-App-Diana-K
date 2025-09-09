const API_KEY = process.env.OWM_API_KEY;

// Date helpers

function todayFormatDate(timestamp) {
  const date = new Date(timestamp);
  let currentHour = date.getHours();
  if (currentHour < 10) currentHour = `0${currentHour}`;
  let currentMinutes = date.getMinutes();
  if (currentMinutes < 10) currentMinutes = `0${currentMinutes}`;

  const days = [
    "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
  ];
  const months = [
    "January","February","March","April","May","June","July","August",
    "September","October","November","December"
  ];

  const currentDay = days[date.getDay()];
  const currentMonth = months[date.getMonth()];
  const currentDate = date.getDate();
  return `${currentDay}, ${currentMonth} ${currentDate}, ${currentHour}:${currentMinutes}`;
}

const now = new Date();
const h3 = document.querySelector(".date");
if (h3) h3.innerHTML = todayFormatDate(now);

function formatDay(unixSeconds) {
  const date = new Date(unixSeconds * 1000);
  const day = date.getDay();
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return days[day];
}

// UI events

function searchCity(event) {
  event.preventDefault();
  const currentCity = document.querySelector("#city-input");
  const h2 = document.querySelector("h2");
  if (currentCity && h2) h2.innerHTML = `Today in ${currentCity.value}`;
}
const searchFormForHeading = document.querySelector("#search-form");
if (searchFormForHeading) searchFormForHeading.addEventListener("submit", searchCity);

// Forecast rendering

function displayForecast(response) {
  const daily = response?.data?.daily || [];
  const forecastElement = document.querySelector("#forecast");
  if (!forecastElement) return;

  // Skip today (index 0), show next 6 days (indexes 1..6)
  const nextSix = daily.slice(1, 7);

  let forecastHTML = `<div class="row">`;
  nextSix.forEach((forecastDay) => {
    forecastHTML += `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
          alt="${forecastDay.weather[0].description || ""}"
          width="40"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max">${Math.round(forecastDay.temp.max)}°</span>
          <span class="weather-forecast-temperature-min">${Math.round(forecastDay.temp.min)}°</span>
        </div>
      </div>
    `;
  });
  forecastHTML += `</div>`;

  forecastElement.innerHTML = forecastHTML;
}


function getForecast(coordinates) {
  if (!API_KEY) {
    console.warn("Missing OWM_API_KEY. Set it in .env (local) and on Netlify.");
    return;
  }
  const url = new URL("https://api.openweathermap.org/data/3.0/onecall");
  url.search = new URLSearchParams({
    lat: coordinates.lat,
    lon: coordinates.lon,
    units: "metric",
    exclude: "current,minutely,hourly,alerts",
    appid: API_KEY
  }).toString();

  axios.get(url.toString())
    .then(displayForecast)
    .catch((e) => {
      console.error("One Call 3.0 failed:", e?.response?.status, e?.response?.data || e.message);
     
    });
}

// Current weather + city search

function showTemperature(response) {
  const iconElement = document.querySelector("#main-icon");
  const currentTemp = document.querySelector("#temperature");
  const humidityElement = document.querySelector("#humidity_number");
  const windElement = document.querySelector("#windspeed_number");
  const dateElement = document.querySelector("#date");

  // numbers + basic fields
  if (currentTemp) currentTemp.innerHTML = `${Math.round(response.data.main.temp)}°C`;
  const descriptionElement = document.querySelector("#today_description");
  if (descriptionElement) descriptionElement.innerHTML = response.data.weather[0].description;
  if (humidityElement) humidityElement.innerHTML = response.data.main.humidity;
  if (dateElement) dateElement.innerHTML = todayFormatDate(response.data.dt * 1000);
  if (windElement) windElement.innerHTML = Math.round(response.data.wind.speed);

  // main icon (HTTPS)
  if (iconElement) {
    iconElement.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);
  }

  // heading + numeric temp (as number only) for unit switch
  const h2 = document.querySelector("h2");
  if (h2) h2.innerHTML = `Today in ${response.data.name}`;
  const tempNumberEl = document.querySelector("#temperature");
  if (tempNumberEl) tempNumberEl.innerHTML = Math.round(response.data.main.temp);

  // save Celsius for toggling
  celciusTemperature = response.data.main.temp;

  // fetch forecast with coords
  getForecast(response.data.coord);
}

function searchCities(city) {
  if (!API_KEY) {
    console.warn("Missing OWM_API_KEY. Set it in .env (local) and on Netlify.");
    return;
  }
  const units = "metric";
  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.search = new URLSearchParams({
    q: city,
    appid: API_KEY,
    units
  }).toString();

  axios.get(url.toString()).then(showTemperature).catch((e) => {
    console.error("Current weather failed:", e?.response?.status, e?.response?.data || e.message);
  });
}

function search(event) {
  event?.preventDefault?.();
  const input = document.querySelector("#city-input");
  if (!input) return;
  const city = input.value.trim();
  if (city) searchCities(city);
}

const searchCityForm = document.querySelector("#search-form");
if (searchCityForm) searchCityForm.addEventListener("submit", search);

// Geolocation

const currentLocationButton = document.querySelector("#currentLocation1");
if (currentLocationButton) currentLocationButton.addEventListener("click", getCurrentLocation);

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function searchLocation(position) {
  if (!API_KEY) {
    console.warn("Missing OWM_API_KEY. Set it in .env (local) and on Netlify.");
    return;
  }
  const lon = position.coords.longitude;
  const lat = position.coords.latitude;
  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.search = new URLSearchParams({
    lat,
    lon,
    appid: API_KEY,
    units: "metric"
  }).toString();

  axios.get(url.toString()).then(showTemperature).catch((e) => {
    console.error("Current weather (geo) failed:", e?.response?.status, e?.response?.data || e.message);
  });
}

// Celsius / Fahrenheit toggle

function handleSubmit(event) {
  event.preventDefault();
  search(event);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  const currentTemp = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  const fahrenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  if (currentTemp) currentTemp.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  const currentTemp = document.querySelector("#temperature");
  if (currentTemp) currentTemp.innerHTML = Math.round(celciusTemperature);
}

let celciusTemperature = null;

const form = document.querySelector("#search-form");
if (form) form.addEventListener("submit", handleSubmit);

const fahrenheitLink = document.querySelector("#fahrenheit");
if (fahrenheitLink) fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

const celsiusLink = document.querySelector("#celsius");
if (celsiusLink) celsiusLink.addEventListener("click", displayCelsiusTemperature);

// Default search

searchCities("Tokyo");

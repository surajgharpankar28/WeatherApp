// Cache DOM elements
const cityNameEl = document.querySelector(".weather_city");
const dateTimeEl = document.querySelector(".weather_date_time");
const forecastEl = document.querySelector(".weather_forecast");
const iconEl = document.querySelector(".weather_icon");
const temperatureEl = document.querySelector(".weather_temperature");
const minTempEl = document.querySelector(".weather_min");
const maxTempEl = document.querySelector(".weather_max");
const feelsLikeEl = document.querySelector(".weather_feelsLike");
const humidityEl = document.querySelector(".weather_humidity");
const windEl = document.querySelector(".weather_wind");
const pressureEl = document.querySelector(".weather_pressure");
const citySearchForm = document.querySelector(".weather_search");
const cityInputEl = document.querySelector(".city_name");
const feedbackEl = document.querySelector(".weather_feedback"); // Add a feedback element in HTML

// Helper function: Get the actual country name
const getCountryName = (code) =>
  new Intl.DisplayNames(["en"], { type: "region" }).of(code);

// Helper function: Get formatted date and time
const getDateTime = (timestamp) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(
    new Date(timestamp * 1000)
  );
};

// Default city
let city = "pune";

// Search functionality
citySearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  city = cityInputEl.value.trim();
  if (city) {
    feedbackEl.textContent = ""; // Clear previous feedback
    getWeatherData();
    cityInputEl.value = ""; // Clear input field
  } else {
    feedbackEl.textContent = "Please enter a city name.";
    feedbackEl.style.color = "red";
  }
});

// Fetch and display weather data
const getWeatherData = async () => {
  const apiKey = "f3ffd8d56b9044c99072cd7ab483feac";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=metric`;

  try {
    const res = await fetch(weatherUrl);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("City not found. Please enter a valid city name.");
      } else {
        throw new Error("Failed to fetch weather data.");
      }
    }

    const data = await res.json();
    const { main, name, weather, wind, sys, dt } = data;

    // Populate weather details
    cityNameEl.textContent = `${name}, ${getCountryName(sys.country)}`;
    dateTimeEl.textContent = getDateTime(dt);
    forecastEl.textContent = weather[0].main;
    iconEl.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" alt="${weather[0].description}" />`;

    temperatureEl.innerHTML = `${main.temp}&#176;`;
    minTempEl.innerHTML = `Min: ${main.temp_min.toFixed()}&#176;`;
    maxTempEl.innerHTML = `Max: ${main.temp_max.toFixed()}&#176;`;
    feelsLikeEl.innerHTML = `${main.feels_like.toFixed(2)}&#176;`;
    humidityEl.innerHTML = `${main.humidity}%`;
    windEl.innerHTML = `${wind.speed} m/s`;
    pressureEl.innerHTML = `${main.pressure} hPa`;

    feedbackEl.textContent = ""; // Clear feedback on success
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    feedbackEl.textContent = error.message;
    feedbackEl.style.color = "red";
  }
};

// Load weather data on page load
window.addEventListener("load", getWeatherData);

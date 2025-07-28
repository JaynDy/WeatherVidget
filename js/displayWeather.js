import { getShortDayOfWeek, capitalizeFirstLetter } from "./utils.js";
import { countryCodesToNames } from "./infCountry.js";
import { groupForecastsByDay } from "./script.js";

export function displayWeatherData(data) {
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = "";

  const dailyForecasts = groupForecastsByDay(data.list);
  const countryName = countryCodesToNames[data.city.country];

  const locationDiv = document.getElementById("location");
  locationDiv.textContent = `Selected: ${data.city.name}, ${data.city.country}`;

  const currentWeather = data.list[0];
  const currentTemp = Math.round(currentWeather.main.temp);
  const isRaining = currentWeather.weather[0].main === "Rain";
  const currentDescription = capitalizeFirstLetter(
    currentWeather.weather[0].description
  );
  const currentIcon = currentWeather.weather[0].icon;
  const cityAndCountry = `${data.city.name}, ${countryName}`;

  const maxTempCurrentDay = Math.round(
    Math.max(...dailyForecasts[0].map((forecast) => forecast.main.temp_max))
  );

  forecastContainer.innerHTML = `
  <div class="current-weather">
    <div class="current-weather-item">
      <p>${currentTemp > 0 ? `+${currentTemp}` : currentTemp}°C</p>
      <div class="current-weather-preci">
        <a>${isRaining ? "Rain" : "No rain"}</a>
        <b>${
          maxTempCurrentDay > 0 ? `+${maxTempCurrentDay}` : maxTempCurrentDay
        }°C</b>
      </div>
    </div>
    
    <div class="current-weather-desc">
      <b>${cityAndCountry}</b>
      <p>${currentDescription}</p>
      
    </div>

    <div class="current-weather-img">
      <img src="http://openweathermap.org/img/w/${currentIcon}.png" alt="${currentDescription}">
    </div>
  </div>
`;

  dailyForecasts.slice(0, 5).forEach((item) => {
    const date = new Date(item[0].dt * 1000);
    const dayOfWeek = getShortDayOfWeek(date);
    const icon = item[0].weather[0].icon;
    const description = capitalizeFirstLetter(item[0].weather[0].description);
    const maxTemp = Math.round(
      Math.max(...item.map((forecast) => forecast.main.temp_max))
    );
    const minTemp = Math.round(
      Math.min(...item.map((forecast) => forecast.main.temp_min))
    );

    const forecastItem = `
    <div class="forecast-item">
      <h2>${dayOfWeek}</h2>
      <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
      <p>${description}</p>
      <div class="item_temp">
       <a>Day</a>
       <b>${maxTemp > 0 ? `+${maxTemp}` : maxTemp}°C</b>
       <b>${minTemp > 0 ? `+${minTemp}` : minTemp}°C</b>
       <a>Night</a>
    </div>
    </div>
  `;

    forecastContainer.insertAdjacentHTML("beforeend", forecastItem);
  });
}

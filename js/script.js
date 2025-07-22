import { apiKey } from "../config.js";
import { cityInput } from "./cityInput.js";
import { fetchDataAndDisplay } from "./weatherData.js";

const defaultCity = "Belgrade";

window.addEventListener("load", async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const city = await getCityName(latitude, longitude);
        cityInput.value = city;
        fetchDataAndDisplay(city);
      },
      () => {
        cityInput.value = defaultCity;
        fetchDataAndDisplay(defaultCity);
      }
    );
  } else {
    cityInput.value = defaultCity;
    fetchDataAndDisplay(defaultCity);
  }
});

async function getCityName(lat, lon) {
  const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=` +
    apiKey;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error("Error:", error);
    return defaultCity;
  }
}

export function groupForecastsByDay(forecasts) {
  const groupedForecasts = {};
  forecasts.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    if (!groupedForecasts[day]) {
      groupedForecasts[day] = [];
    }
    groupedForecasts[day].push(forecast);
  });
  return Object.values(groupedForecasts);
}

import { apiKey } from "../config.js";
import { displayWeatherData } from "./displayWeather.js";

export const forecastUrl =
  "https://api.openweathermap.org/data/2.5/forecast?q=CITY_NAME&units=metric&appid=" +
  apiKey;

export async function fetchWeatherData(city) {
  try {
    const response = await fetch(forecastUrl.replace("CITY_NAME", city));
    const data = await response.json();

    if (data.cod !== "200") {
      throw new Error(data.message || "Failed to fetch weather data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

export async function fetchDataAndDisplay(city) {
  try {
    const data = await fetchWeatherData(city);

    if (!data) {
      console.warn("No weather data to display");
      return;
    }

    displayWeatherData(data);
    console.log(data);
  } catch (error) {
    console.error("Error handling weather data:", error);
  }
}

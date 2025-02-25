import { fetchWeatherData, fetchDataAndDisplay } from "./weatherData.js";

export const cityInput = document.getElementById("city-input");

cityInput.addEventListener("search", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    fetchWeatherData(city);
  }
});

cityInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const city = cityInput.value.trim();
    if (city !== "") {
      fetchDataAndDisplay(city);
    }
  }
});

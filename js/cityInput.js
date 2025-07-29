import { fetchWeatherData, fetchDataAndDisplay } from "./weatherData.js";

export const cityInput = document.getElementById("city-input");
const suggestionsList = document.createElement("ul");
let activeSuggestionIndex = -1;
let currentSuggestions = [];

cityInput.addEventListener("input", async () => {
  const query = cityInput.value.trim();

  if (query.length > 2) {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=20&appid=dcfe9474dd3ab3c882f9356b26a09dba`
    );
    const data = await response.json();

    const filtered = data.filter((city) =>
      city.name.toLowerCase().startsWith(query.toLowerCase())
    );

    const unique = Array.from(
      new Map(filtered.map((item) => [item.name, item])).values()
    );

    currentSuggestions = unique;
    activeSuggestionIndex = -1;
    showSuggestions(currentSuggestions);
  } else {
    clearSuggestions();
  }
});

cityInput.addEventListener("search", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    fetchWeatherData(city);
    clearSuggestions();
  }
});

function showSuggestions(cities) {
  clearSuggestions();

  if (!cities.length) return;

  suggestionsList.className = "city-suggestions";

  cities.forEach((city, index) => {
    const li = document.createElement("li");
    li.textContent = city.name;
    li.dataset.index = index;
    li.addEventListener("click", () => {
      cityInput.value = city.name;
      fetchDataAndDisplay(city.name);
      clearSuggestions();
    });
    suggestionsList.appendChild(li);
  });

  if (!suggestionsList.parentNode) {
    cityInput.insertAdjacentElement("afterend", suggestionsList);
  }
}

function highlightActive() {
  const items = suggestionsList.querySelectorAll("li");

  items.forEach((item, index) => {
    item.classList.toggle("active", index === activeSuggestionIndex);
    if (index === activeSuggestionIndex) {
      item.scrollIntoView({ block: "nearest" });
    }
  });
}

function clearSuggestions() {
  suggestionsList.innerHTML = "";
  if (suggestionsList.parentNode) {
    suggestionsList.remove();
  }
}

cityInput.addEventListener("keydown", (event) => {
  const items = suggestionsList.querySelectorAll("li");
  if (items.length === 0) return;

  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
    highlightActive();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeSuggestionIndex =
      (activeSuggestionIndex - 1 + items.length) % items.length;
    highlightActive();
  } else if (event.key === "PageDown") {
    event.preventDefault();
    activeSuggestionIndex = Math.min(
      activeSuggestionIndex + 5,
      items.length - 1
    );
    highlightActive();
  } else if (event.key === "PageUp") {
    event.preventDefault();
    activeSuggestionIndex = Math.max(activeSuggestionIndex - 5, 0);
    highlightActive();
  } else if (event.key === "Enter") {
    event.preventDefault();
    if (activeSuggestionIndex >= 0) {
      const selectedCity = currentSuggestions[activeSuggestionIndex];
      if (selectedCity) {
        cityInput.value = selectedCity.name;
        fetchDataAndDisplay(selectedCity.name);
        clearSuggestions();
      }
    } else {
      const city = cityInput.value.trim();
      if (city !== "") {
        fetchDataAndDisplay(city);
        clearSuggestions();
      }
    }
  }
});

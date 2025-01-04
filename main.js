const apiKey = "f1dd8b07290cac9addb749449ec2cf5d";
const geoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";

// DOM Elements
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const Icon = document.querySelector(".icon");

// Default icon and description
const defaultIcon = "https://openweathermap.org/img/wn/01d.png";
const defaultDescription = "Clear";

// Fetch weather using coordinates
async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(`${weatherApiUrl}lat=${lat}&lon=${lon}&appid=${apiKey}`);
        if (!response.ok) throw new Error("Failed to fetch weather data.");
        const data = await response.json();

        // Update the DOM with weather data
        document.querySelector(".city").innerHTML = data.name || "Unknown City";
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        // Update the weather icon and description
        Icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        document.querySelector(".description").innerHTML = data.weather[0].main || "No Description";
    } catch (error) {
        console.error(error.message);
        alert("Unable to fetch weather data. Please try again later.");
    }
}

// Fetch coordinates for the city
async function fetchCoordinates(city) {
    try {
        const response = await fetch(`${geoApiUrl}${city}&limit=1&appid=${apiKey}`);
        if (!response.ok) throw new Error("Failed to fetch city coordinates.");
        const data = await response.json();

        if (!data.length) throw new Error("City not found. Please check the spelling or try another location.");
        const { lat, lon } = data[0];

        // Fetch weather using the coordinates
        await fetchWeather(lat, lon);
    } catch (error) {
        console.error(error.message);
        alert(error.message);
    }
}

// Event listener for the search button
searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (!city) {
        alert("Please enter a city name!");
        return;
    }
    fetchCoordinates(city);
});

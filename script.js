const apiKey = "ece191a1832e38057c2caa4986f26d0a";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const weatherResult = document.getElementById("weatherResult");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("errorMsg");

searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim() !== "") {
        getWeatherByCity(cityInput.value.trim());
    }
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

locationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(position => {
        getWeatherByCoords(position.coords.latitude, position.coords.longitude);
    });
});

async function getWeatherByCity(city) {
    showLoading();
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();

        if (data.cod !== 200) throw new Error(data.message);

        displayWeather(data);
    } catch (error) {
        showError("City not found!");
    }
}

async function getWeatherByCoords(lat, lon) {
    showLoading();
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();
        displayWeather(data);
    } catch {
        showError("Unable to fetch location weather.");
    }
}

function displayWeather(data) {
    loading.classList.add("hidden");
    errorMsg.classList.add("hidden");
    weatherResult.classList.remove("hidden");

    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temperature").innerText = `🌡 ${data.main.temp} °C`;
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").innerText = `🌬 Wind: ${data.wind.speed} m/s`;

    const iconCode = data.weather[0].icon;
    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function showLoading() {
    weatherResult.classList.add("hidden");
    errorMsg.classList.add("hidden");
    loading.classList.remove("hidden");
}

function showError(message) {
    loading.classList.add("hidden");
    weatherResult.classList.add("hidden");
    errorMsg.innerText = message;
    errorMsg.classList.remove("hidden");
}

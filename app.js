const apiKey = '57d94af989e8ae592b1bbbc4d5c69092'; // Replace with your OpenWeatherMap API key

// Function to fetch weather data based on latitude and longitude
function getWeather(lat, lon) {
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(api)
        .then(response => response.json())
        .then(data => {
            const location = data.name;
            const weather = data.weather[0].description;
            const temperature = data.main.temp;
            const feels_like = data.main.feels_like;
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;
            const wind = data.wind.speed;
            const visibility = data.visibility / 1000; // Convert to kilometers
            const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            // Update DOM elements with weather data
            document.getElementById('location').innerText = `Location: ${location}`;
            document.getElementById('weather').innerText = `Weather: ${weather}`;
            document.getElementById('temperature').innerText = `Temperature: ${temperature} °C`;
            document.getElementById('feels_like').innerText = `Feels Like: ${feels_like} °C`;
            document.getElementById('humidity').innerText = `Humidity: ${humidity}%`;
            document.getElementById('pressure').innerText = `Pressure: ${pressure} hPa`;
            document.getElementById('wind').innerText = `Wind Speed: ${wind} m/s`;
            document.getElementById('visibility').innerText = `Visibility: ${visibility} km`;
            document.getElementById('icon').src = icon;

            // Change background color based on weather
            changeBackground(weather);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Function to get 5-day weather forecast
function getForecast(lat, lon) {
    const api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(api)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.getElementById('forecast-container');
            forecastContainer.innerHTML = ''; // Clear previous forecast

            // Display the forecast for 5 days (one data point per day at 12:00 PM)
            for (let i = 0; i < data.list.length; i += 8) {
                const forecast = data.list[i];
                const date = new Date(forecast.dt_txt).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' });
                const temp = forecast.main.temp;
                const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

                forecastContainer.innerHTML += `
                    <div class="forecast-item">
                        <div class="forecast-date">${date}</div>
                        <img src="${icon}" alt="weather icon" class="forecast-icon">
                        <div class="forecast-temp">${temp} °C</div>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

// Function to change background based on weather condition
function changeBackground(weather) {
    const container = document.querySelector('.weather-container');
    if (weather.includes('rain')) {
        container.style.backgroundColor = '#a3c1f0';
    } else if (weather.includes('cloud')) {
        container.style.backgroundColor = '#d3d3d3';
    } else if (weather.includes('clear')) {
        container.style.backgroundColor = '#f5d742';
    } else {
        container.style.backgroundColor = '#f0f4f8';
    }
}

// Function to get user's geolocation and call the weather API
function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(lat, lon);
            getForecast(lat, lon);
        }, (error) => {
            console.error('Error getting geolocation:', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// Call the geolocation function when the page loads
window.onload = getGeolocation;

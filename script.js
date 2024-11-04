// script.js

// Initialize the map
const map = L.map('map').setView([20, 0], 2);  // Initial global view



// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Function to fetch and display weather data
async function fetchWeatherData() {
  const location = document.getElementById('location').value;
  const apiKey = 'YOUR_API_KEY';

  // API endpoints
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
  const airQualityURL = `https://api.openweathermap.org/data/2.5/air_pollution?q=${location}&appid=${apiKey}`;

  try {
    // Fetch data from the API endpoints
    const [currentWeather, forecast, airQuality] = await Promise.all([
      fetch(currentWeatherURL).then(res => res.json()),
      fetch(forecastURL).then(res => res.json()),
      fetch(airQualityURL).then(res => res.json())
    ]);

    // Display current weather
    displayWeatherMarker(currentWeather, "Current Weather");

    // Display forecast (e.g., weather after 3 hours)
    displayWeatherMarker(forecast.list[1], "3-Hour Forecast");

    // Display air quality
    displayAirQualityMarker(airQuality);

  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Unable to retrieve weather data. Please check your input and try again.');
  }
}

// Function to display a weather marker on the map
function displayWeatherMarker(data, label) {
  const { coord, main, weather } = data;
  const marker = L.marker([coord.lat, coord.lon]).addTo(map);

  // Customize popup with weather information
  marker.bindPopup(`
    <b>${label}</b><br>
    Temperature: ${main.temp} °C<br>
    Weather: ${weather[0].description}<br>
    Humidity: ${main.humidity}%
  `).openPopup();

  map.setView([coord.lat, coord.lon], 10);  // Zoom into the location
}

// Function to display air quality information
function displayAirQualityMarker(data) {
  const { coord, list } = data;
  const { aqi } = list[0].main;

  const marker = L.circleMarker([coord.lat, coord.lon], {
    color: aqiColor(aqi),
    radius: 8
  }).addTo(map);

  // Customize popup with air quality information
  marker.bindPopup(`
    <b>Air Quality Index</b><br>
    AQI Level: ${aqi}
  `).openPopup();
}

// Function to determine AQI color
function aqiColor(aqi) {
  if (aqi === 1) return 'green';
  if (aqi === 2) return 'yellow';
  if (aqi === 3) return 'orange';
  if (aqi === 4) return 'red';
  return 'purple';
}

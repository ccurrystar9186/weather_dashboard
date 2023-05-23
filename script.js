document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'c39f0423db3f44f79c93c65b7679fdeb';
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const currentWeatherContainer = document.getElementById('current-weather-container');
    const forecastContainer = document.getElementById('forecast-container');
    const searchHistoryList = document.getElementById('search-history-list');
  
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = cityInput.value.trim();
      if (city) {
        getCoordinates(city)
          .then((coordinates) => getWeatherData(coordinates))
          .then((weatherData) => {        
            displayCurrentWeather(weatherData.currentWeather,city);
            displayForecast(weatherData.forecast);
            addSearchHistory(city);
          })
          .catch((error) => {
            console.error(error);
            alert('An error occurred while retrieving weather data.');
          });
      }
      cityInput.value = '';
    });
  
    searchHistoryList.addEventListener('click', (e) => {
      const listItem = e.target;
      if (listItem.tagName === 'LI') {
        const city = listItem.textContent;
        getCoordinates(city)
          .then((coordinates) => getWeatherData(coordinates))
          .then((weatherData) => {
            displayCurrentWeather(weatherData.currentWeather,city);
            displayForecast(weatherData.forecast);
          })
          .catch((error) => {
            console.error(error);
            alert('An error occurred while retrieving weather data.');
          });
      }
    });
  
    function getCoordinates(city) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
      return fetch(apiUrl)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Unable to retrieve coordinates for the city.');
          }
        })
        .then((data) => {
          const coordinates = {
            lat: data.coord.lat,
            lon: data.coord.lon
          };
          return coordinates;
        });
    }
  
    function getWeatherData(coordinates) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}`;
      return fetch(apiUrl)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Unable to retrieve weather data for the city.');
          }
        })
        .then((data) => {
          const weatherData = {
            currentWeather: data.list[0],
            forecast: data.list.slice(1, 6)
          };
          return weatherData;
        });
    }
  
    function displayCurrentWeather(currentWeather,city) {
      const { dt, weather, main, wind } = currentWeather;
      const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
      const date = new Date(dt * 1000).toLocaleDateString();
      const html = `
        <div class="weather-card">
          <h3>${city}</h3>
          <h3>${date}</h3>
          <img src="${iconUrl}" alt="Weather Icon">
          <p>Temperature: ${Math.round(main.temp)}°F</p>
          <p>Humidity: ${main.humidity}%</p>
          <p>Wind Speed: ${wind.speed} mph</p>
        </div>
      `;
      currentWeatherContainer.innerHTML = html;
    }
  
    function displayForecast(forecast) {
      let html = '';
      forecast.forEach((item) => {
        const { dt, weather, main, wind } = item;
        const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
        const date = new Date(dt * 1000).toLocaleDateString();
        html += `
          <div class="weather-card">
            <h3>${date}</h3>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>Temperature: ${Math.round(main.temp)}°F</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} mph</p>
          </div>
        `;
      });
      forecastContainer.innerHTML = html;
    }
  
    function addSearchHistory(city) {
      const listItem = document.createElement('li');
      listItem.textContent = city;
      searchHistoryList.prepend(listItem);
    }
  });
  
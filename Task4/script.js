document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const searchButton = document.querySelector('.search-box button');
  const weatherBox = document.querySelector('.weather-box');
  const weatherDetails = document.querySelector('.weather-details');

  searchButton.addEventListener('click', () => {
    const APIKey = '05d061867262cc7b8c69e930609c0c92';
    const location = document.querySelector('.search-box input').value; 

    if (!location) { 
      alert('Invalid!!! Please enter a location name');
      return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIKey}`)
      .then(response => response.json()) 
      .then(json => {
        if (json.cod === '404') {
          alert('Location not found!!!');
          return;
        }

        const image = document.querySelector('img');
        image.src = `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;

        const temperature = document.querySelector('.temp');
        const description = document.querySelector('.description');
        const humidity = document.querySelector('.humidity span');
        const wind = document.querySelector('.wind span');

        temperature.innerHTML = `${json.main.temp}<span>°C</span>`; 
        description.textContent = json.weather[0].description;
        humidity.textContent = `${json.main.humidity}%`; 
        wind.textContent = `${json.wind.speed} m/s`;
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        alert('Failed to retrieve weather data.');
      });
  });
});

import { moment } from "moment-es6";
import './style.css';

let apiKey = 'eae1491e89f960425a0971c74103081f'

let currentData;
let threeHourData;

function initializeBaseDivs() {
  let container = document.createElement('div');
  container.setAttribute('id', 'content');
  document.body.appendChild(container);
  
  let headerDiv = document.createElement('div');
  headerDiv.setAttribute('id', 'header');
  container.appendChild(headerDiv);

  let weatherTodayDiv = document.createElement('div');
  weatherTodayDiv.setAttribute('id', 'weatherToday');
  container.appendChild(weatherTodayDiv);

  let extraInfoDiv = document.createElement('div');
  extraInfoDiv.setAttribute('id', 'extraInfo');
  container.appendChild(extraInfoDiv);

  let weatherWeekDiv = document.createElement('div');
  weatherWeekDiv.setAttribute('id', 'weatherWeek');
  container.appendChild(weatherWeekDiv);

  let footerDiv = document.createElement('div');
  footerDiv.setAttribute('id', 'footer');
  container.appendChild(footerDiv);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function drawWeatherNow() {
  let container = document.getElementById('weatherToday');

  let wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'weatherNow');

  let weatherNowLocationDiv = document.createElement('div');
  weatherNowLocationDiv.setAttribute('id', 'weatherNowLocation');
  weatherNowLocationDiv.innerHTML = (currentData.name);
  wrapper.appendChild(weatherNowLocationDiv);

  let weatherNowPatternDiv = document.createElement('div');
  weatherNowPatternDiv.setAttribute('id', 'weatherNowPattern');
  weatherNowPatternDiv.innerHTML = (currentData.weather[0].main);
  wrapper.appendChild(weatherNowPatternDiv);

  let weatherNowTempDiv = document.createElement('div');
  weatherNowTempDiv.setAttribute('id', 'weatherNowTemp');
  weatherNowTempDiv.innerHTML = (Math.round(currentData.main.temp -273.15) + '&#176;C');
  wrapper.appendChild(weatherNowTempDiv);

  let weatherNowTempFeelsDiv = document.createElement('div');
  weatherNowTempFeelsDiv.setAttribute('id', 'weatherNowTempFeels');
  weatherNowTempFeelsDiv.innerHTML = ('Feels like ' + Math.round(currentData.main.feels_like -273.15) + '&#176;C');
  wrapper.appendChild(weatherNowTempFeelsDiv);

  let weatherNowHighDiv = document.createElement('div');
  weatherNowHighDiv.setAttribute('id', 'weatherNowHigh');
  weatherNowHighDiv.innerHTML = ('High: ' + Math.round(currentData.main.temp_max -273.15) + '&#176;C');
  wrapper.appendChild(weatherNowHighDiv);

  let weatherNowLowDiv = document.createElement('div');
  weatherNowLowDiv.setAttribute('id', 'weatherNowLow');
  weatherNowLowDiv.innerHTML = ('Low: ' + Math.round(currentData.main.temp_min -273.15) + '&#176;C');
  wrapper.appendChild(weatherNowLowDiv);

  container.appendChild(wrapper);
}

async function currentWeather() {
  const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Auckland&appid=eae1491e89f960425a0971c74103081f', { mode: 'cors' });
  const weatherData = await response.json();
  currentData = weatherData;
  drawWeatherNow();
  drawExtraInfo();
}

async function threeHourWeather() {
  const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?q=Auckland&appid=eae1491e89f960425a0971c74103081f', { mode: 'cors' });
  const weatherData = await response.json();
  threeHourData = weatherData;
  drawWeatherNext24Hours();
}

function drawWeatherNext24Hours() {
  let container = document.getElementById('weatherToday');

  let outerWrapper = document.createElement('div');
  outerWrapper.setAttribute('id', 'weather3Hour');

  console.log(threeHourData)

  for (let i = 1; i <6; i++) {
    let wrapper = document.createElement('div');
    wrapper.setAttribute('id', 'weather3HourContainer-' + i);
    wrapper.classList.add('3-hour-container')

    let timeDiv = document.createElement('div');
    timeDiv.setAttribute('id', 'timeDiv0')
    timeDiv.classList.add('3-hour-container-time');
    timeDiv.innerHTML = ('in ' + i*3 + ' Hours');
    wrapper.appendChild(timeDiv);

    let humidityDiv = document.createElement('div');
    humidityDiv.classList.add('3-hour-container-humidity');
    humidityDiv.innerHTML = (threeHourData.list[i].main.humidity + '%');
    wrapper.appendChild(humidityDiv);

    let tempDiv = document.createElement('div');
    tempDiv.classList.add('3-hour-container-temp');
    tempDiv.innerHTML = (Math.round(threeHourData.list[i].main.temp -273.15) + '&#176;C');
    wrapper.appendChild(tempDiv);

    outerWrapper.appendChild(wrapper)
  }

  container.appendChild(outerWrapper);

}

function drawExtraInfo() {
  let wrapper = document.getElementById('extraInfo');

  let container = document.createElement('div');
  container.setAttribute('id', 'weatherExtraInfoContainer');

  let sunriseDiv = document.createElement('div');
  let sunriseValue = currentData.sys.sunrise
  let sunriseTime = new Date((sunriseValue) * 1000).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
  sunriseDiv.innerHTML = sunriseTime;
  sunriseDiv.setAttribute('id', 'weatherExtraInfoSunrise');
  sunriseDiv.classList.add('weather-extra-info-subcontainer');
  container.appendChild(sunriseDiv);

  console.log(currentData);

  let sunsetDiv = document.createElement('div');
  let sunsetValue = currentData.sys.sunset
  let sunsetTime = new Date((sunsetValue) * 1000).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
  sunsetDiv.innerHTML = sunsetTime;
  sunsetDiv.setAttribute('id', 'weatherExtraInfoSunset');
  sunsetDiv.classList.add('weather-extra-info-subcontainer');
  container.appendChild(sunsetDiv);

  let precipitationChanceDiv = document.createElement('div');


  wrapper.appendChild(container);
}

initializeBaseDivs();
document.addEventListener("DOMContentLoaded", dataFetch, false);
drawExtraInfo();

async function dataFetch() {
  currentWeather();
  threeHourWeather();
}

  
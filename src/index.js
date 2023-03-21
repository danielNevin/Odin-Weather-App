import { head, set, wrap } from "lodash";
import { moment } from "moment-es6";
import './style.css';

let apiKey = 'eae1491e89f960425a0971c74103081f'

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

function parseWindDeg(degrees) {
  let index = parseInt((degrees / 22.5) + .5);
  let directionArray = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return directionArray[(index % 16)];
}

async function userLocationWeatherData(position) {
  const reponse = await fetch('https://api.openweathermap.org/data/3.0/onecall?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&appid=eae1491e89f960425a0971c74103081f', { mode: 'cors' });
  const data = await reponse.json();
  return data;
}

async function weatherDataFetch(City) {
  const response1 = await fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + City + '&limit=5&appid=' + apiKey, { mode: 'cors' });
  const geoData = await response1.json();
  const response2 = await fetch('https://api.openweathermap.org/data/3.0/onecall?lat=' + geoData[0].lat + '&lon=' + geoData[0].lon + '&appid=eae1491e89f960425a0971c74103081f', { mode: 'cors' });
  const data = await response2.json();
  return data;
}

function renderWeatherDivs() {
  drawHeader()
  drawWeatherNow();
  drawWeatherNext24Hours();
  drawExtraInfo();
  drawWeekWeather();
  drawFooter();
}

function weatherData() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async(position) => {
      weatherData = await userLocationWeatherData(position);
      console.log(weatherData);
      injectData(weatherData);
    },
    async(err) => {
      weatherData = await weatherDataFetch('Palmerston North');
      injectData(weatherData);
    })
  } else {
    alert('Geolocation is not supported by your browser')
  }
}

function drawHeader() {
  let container = document.getElementById('header');

  let wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'headerWrapper');

  let headerLogo = document.createElement('img');
  headerLogo.src = 'https://seeklogo.com/images/O/openweather-logo-3CE20F48B5-seeklogo.com.png';
  headerLogo.setAttribute('id', 'headerLogo');
  wrapper.appendChild(headerLogo);
  
  let headerInputDiv = document.createElement('div');
  headerInputDiv.setAttribute('id', 'headerInputDiv');
  wrapper.appendChild(headerInputDiv);

  let headerInputBox = document.createElement('input');
  headerInputBox.setAttribute('id', 'headerInputBox');
  headerInputDiv.appendChild(headerInputBox);

  let headerInputSubmit = document.createElement('button');
  headerInputSubmit.setAttribute('id', 'headerInputSubmit');
  headerInputSubmit.innerHTML = 'SEARCH'
  headerInputSubmit.onclick = async function() {
    let City = document.getElementById('headerInputBox').value;
    document.getElementById('headerInputBox').value = '';
    let weatherData = await weatherDataFetch(City);
    injectData(weatherData);
  }
  headerInputDiv.appendChild(headerInputSubmit);

  let headerUnitButton = document.createElement('button');
  headerUnitButton.setAttribute('id', 'headerUnitButton');
  headerUnitButton.innerHTML = '&#176;C'
  wrapper.appendChild(headerUnitButton);

  container.appendChild(wrapper);
}

function drawWeatherNow() {
  let container = document.getElementById('weatherToday');

  let wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'weatherNow');

  let weatherNowLocationDiv = document.createElement('div');
  weatherNowLocationDiv.setAttribute('id', 'weatherNowLocation');
  wrapper.appendChild(weatherNowLocationDiv);

  let weatherNowPatternDiv = document.createElement('div');
  weatherNowPatternDiv.setAttribute('id', 'weatherNowPattern');
  wrapper.appendChild(weatherNowPatternDiv);

  let weatherNowPatternImg = document.createElement('img');
  weatherNowPatternImg.setAttribute('id', 'weatherNowPatternImg');
  wrapper.appendChild(weatherNowPatternImg);

  let weatherNowTempDiv = document.createElement('div');
  weatherNowTempDiv.setAttribute('id', 'weatherNowTemp');
  wrapper.appendChild(weatherNowTempDiv);

  let weatherNowTempFeelsDiv = document.createElement('div');
  weatherNowTempFeelsDiv.setAttribute('id', 'weatherNowTempFeels');
  wrapper.appendChild(weatherNowTempFeelsDiv);

  container.appendChild(wrapper);

}

function drawWeatherNext24Hours() {
  let container = document.getElementById('weatherToday');

  let outerWrapper = document.createElement('div');
  outerWrapper.setAttribute('id', 'weather3Hour');

  for (let i = 1; i <24; i++) {
    let wrapper = document.createElement('div');
    wrapper.setAttribute('id', 'weather3HourContainer-' + i);
    wrapper.classList.add('three-hour-container')

    let timeDiv = document.createElement('span');
    timeDiv.setAttribute('id', 'timeDiv-' + i);
    timeDiv.classList.add('three-hour-container-time');
    if (i === 1) {
      timeDiv.innerHTML = ('in ' + i + ' Hour');
    } else {
      timeDiv.innerHTML = ('in ' + i + ' Hours');
    }
    wrapper.appendChild(timeDiv);

    let chanceOfRainDiv = document.createElement('div');
    chanceOfRainDiv.setAttribute('id', 'chanceOfRainDiv-' + i);
    chanceOfRainDiv.classList.add('three-hour-container-rain');
    wrapper.appendChild(chanceOfRainDiv);

    let weatherIcon = document.createElement('img');
    weatherIcon.setAttribute('id', 'iconDiv-' + i)
    wrapper.appendChild(weatherIcon);

    let tempDiv = document.createElement('div');
    tempDiv.setAttribute('id', 'tempDiv-' + i);
    tempDiv.classList.add('three-hour-container-temp');
    wrapper.appendChild(tempDiv);

    outerWrapper.appendChild(wrapper)
  }

  container.appendChild(outerWrapper);

}

function drawExtraInfo() {
  let container = document.getElementById('extraInfo');

  let wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'weatherExtraInfoWrapper');

  let sunriseDivTitle = document.createElement('div');
  sunriseDivTitle.classList.add('weather-extra-info-subcontainer-title');
  sunriseDivTitle.innerHTML = 'SUNRISE';
  wrapper.appendChild(sunriseDivTitle);

  let sunsetDivTitle = document.createElement('div');
  sunsetDivTitle.classList.add('weather-extra-info-subcontainer-title');
  sunsetDivTitle.innerHTML = 'SUNSET';
  wrapper.appendChild(sunsetDivTitle);

  let humidityDivTitle = document.createElement('div');
  humidityDivTitle.classList.add('weather-extra-info-subcontainer-title');
  humidityDivTitle.innerHTML = 'HUMIDITY';
  wrapper.appendChild(humidityDivTitle);

  let precipitationDivTitle = document.createElement('div');
  precipitationDivTitle.classList.add('weather-extra-info-subcontainer-title');
  precipitationDivTitle.innerHTML = 'TOTAL RAIN';
  wrapper.appendChild(precipitationDivTitle);

  let chanceOfRainDivTitle = document.createElement('div');
  chanceOfRainDivTitle.classList.add('weather-extra-info-subcontainer-title');
  chanceOfRainDivTitle.innerHTML = 'CHANCE OF RAIN';
  wrapper.appendChild(chanceOfRainDivTitle);

  let windDivTitle = document.createElement('div');
  windDivTitle.classList.add('weather-extra-info-subcontainer-title');
  windDivTitle.innerHTML = 'WIND';
  wrapper.appendChild(windDivTitle);

  let pressureDivTitle = document.createElement('div');
  pressureDivTitle.classList.add('weather-extra-info-subcontainer-title');
  pressureDivTitle.innerHTML = 'PRESSURE';
  wrapper.appendChild(pressureDivTitle);

  let sunriseDiv = document.createElement('div');
  sunriseDiv.setAttribute('id', 'weatherExtraInfoSunrise');
  sunriseDiv.classList.add('weather-extra-info-subcontainer');
  wrapper.appendChild(sunriseDiv);

  let sunsetDiv = document.createElement('div');
  sunsetDiv.setAttribute('id', 'weatherExtraInfoSunset');
  sunsetDiv.classList.add('weather-extra-info-subcontainer');
  wrapper.appendChild(sunsetDiv);

  let humidityDiv = document.createElement('div');
  humidityDiv.setAttribute('id', 'weatherExtraInfoHumidity');
  humidityDiv.classList.add('weather-extra-info-subcontainer');
  wrapper.appendChild(humidityDiv);

  let precipitationDiv = document.createElement('div');
  precipitationDiv.setAttribute('id', 'weatherExtraInfoPrecipitation');
  precipitationDiv.classList.add('weather-extra-info-subcontainer');
  wrapper.appendChild(precipitationDiv);

  let chanceOfRainDiv = document.createElement('div');
  chanceOfRainDiv.setAttribute('id', 'weatherExtraInfoRain');
  chanceOfRainDiv.classList.add('weather-extra-info-subcontainer');
  wrapper.appendChild(chanceOfRainDiv);

  let windDiv = document.createElement('div');
  windDiv.setAttribute('id', 'weatherExtraInfoWind');
  windDiv.classList.add('weather-extra-info-subcontainer');
  wrapper.appendChild(windDiv);

  let pressureDiv = document.createElement('div');
  pressureDiv.setAttribute('id', 'weatherExtraInfoPressure');
  pressureDiv.classList.add('weather-extra-info-subcontainer');
  wrapper.appendChild(pressureDiv);

  container.appendChild(wrapper);

}

function drawWeekWeather() {
  let container = document.getElementById('weatherWeek');

  let dayContainer = document.createElement('div')
  dayContainer.setAttribute('id', 'dayContainer');
  dayContainer.classList.add('weather-week-info-container');
  container.appendChild(dayContainer);

  let iconContainer = document.createElement('div')
  iconContainer.setAttribute('id', 'iconContainer');
  iconContainer.classList.add('weather-week-info-container');
  container.appendChild(iconContainer);

  let humidityContainer = document.createElement('div')
  humidityContainer.setAttribute('id', 'humidityContainer');
  humidityContainer.classList.add('weather-week-info-container');
  container.appendChild(humidityContainer);

  let rainContainer = document.createElement('div')
  rainContainer.setAttribute('id', 'rainContainer');
  rainContainer.classList.add('weather-week-info-container');
  container.appendChild(rainContainer);

  let tempContainer = document.createElement('div')
  tempContainer.setAttribute('id', 'tempContainer');
  tempContainer.classList.add('weather-week-info-container');
  container.appendChild(tempContainer);

  let dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date();
  let day = d.getDay();

  for (let i = 1; i < 8; i++) {

    let dayDiv = document.createElement('div');
    dayDiv.setAttribute('id', 'weatherWeekDay-' + i);
    if (day >= 6) {
      day = 0;
    } else {
      day++;
    }
    dayDiv.innerHTML = dayArray[day];
    dayContainer.appendChild(dayDiv);

    let weatherIcon = document.createElement('img');
    weatherIcon.setAttribute('id', 'weatherWeekIcon-' + i)
    iconContainer.appendChild(weatherIcon);

    let chanceOfRain = document.createElement('div');
    chanceOfRain.setAttribute('id', 'weatherWeekChanceOfRain-' + i)
    rainContainer.appendChild(chanceOfRain);

    let humidity = document.createElement('div');
    humidity.setAttribute('id', 'weatherWeekHumidity-' + i);
    humidityContainer.appendChild(humidity);

    let temp = document.createElement('div');
    temp.setAttribute('id', 'weatherWeekTemp-' + i);
    tempContainer.appendChild(temp);

  }

}

function drawFooter() {
  let container = document.getElementById('footer');

  let footerDiv = document.createElement('div');
  footerDiv.setAttribute('id', 'footerDiv');
  footerDiv.innerHTML = '&copy; https://github.com/dnevin234'
  container.appendChild(footerDiv);
}

initializeBaseDivs();
renderWeatherDivs()
document.addEventListener("DOMContentLoaded", dataFetch, false);

async function dataFetch() {
  weatherData();
}

function injectData(weatherData) {

  /* Current Weather Data Injection */
  let weatherNowLocationDiv = document.getElementById('weatherNowLocation');
  weatherNowLocationDiv.innerHTML = (weatherData.timezone);

  let weatherNowPatternDiv = document.getElementById('weatherNowPattern');
  weatherNowPatternDiv.innerHTML = (weatherData.current.weather[0].main);

  let weatherNowPatternImg = document.getElementById('weatherNowPatternImg');
  weatherNowPatternImg.src = ("http://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + ".png");

  let weatherNowTempDiv = document.getElementById('weatherNowTemp');
  weatherNowTempDiv.innerHTML = (Math.round(weatherData.current.temp -273.15) + '&#176;');

  let weatherNowTempFeelsDiv = document.getElementById('weatherNowTempFeels');
  weatherNowTempFeelsDiv.innerHTML = ('Feels like ' + Math.round(weatherData.current.feels_like -273.15) + '&#176;');

  /* Per-Hour Weather Data Injection */
  for (let i = 1; i <24; i++) {
    let chanceOfRainDiv = document.getElementById('chanceOfRainDiv-' + i)
    chanceOfRainDiv.innerHTML = Math.round(weatherData.hourly[i].pop * 100) + '%';

    let dayWeatherIcon = document.getElementById('iconDiv-' + i);
    dayWeatherIcon.src = ("http://openweathermap.org/img/wn/" + weatherData.hourly[i].weather[0].icon + ".png");

    let tempDiv = document.getElementById('tempDiv-' + i)
    tempDiv.innerHTML = (Math.round(weatherData.hourly[i].temp -273.15) + '&#176;');
  }

  /* Extra Info Weather Data Injection */
  let sunriseDiv = document.getElementById('weatherExtraInfoSunrise');
  let sunriseTime = new Date((weatherData.current.sunrise) * 1000).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
  sunriseDiv.innerHTML = sunriseTime;

  let sunsetDiv = document.getElementById('weatherExtraInfoSunset');
  let sunsetTime = new Date((weatherData.current.sunset) * 1000).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
  sunsetDiv.innerHTML = sunsetTime;

  let humidityDiv = document.getElementById('weatherExtraInfoHumidity');
  humidityDiv.innerHTML = (weatherData.current.humidity + '%');

  let precipitationDiv = document.getElementById('weatherExtraInfoPrecipitation');
  precipitationDiv.innerHTML = (Math.round(weatherData.daily[0].rain) + 'mm');

  let chanceOfRainDiv = document.getElementById('weatherExtraInfoRain');
  chanceOfRainDiv.innerHTML = Math.round(weatherData.hourly[0].pop * 100) + '%';

  let windDiv = document.getElementById('weatherExtraInfoWind');
  windDiv.innerHTML = (Math.round(weatherData.current.wind_speed * 3.6) + ' km/h '+ parseWindDeg(weatherData.current.wind_deg));

  let pressureDiv = document.getElementById('weatherExtraInfoPressure');
  pressureDiv.innerHTML = (Math.round(weatherData.current.pressure) + ' hPa');

  /* Rest of the Week Weather Data */
  for (let i = 1; i < 8; i++) {
    let weekWeatherIcon = document.getElementById('weatherWeekIcon-' + i);
    weekWeatherIcon.src = ("http://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + ".png");

    let chanceOfRain = document.getElementById('weatherWeekChanceOfRain-' + i);
    chanceOfRain.innerHTML = Math.round(weatherData.daily[i].pop * 100) + '%';

    let humidity = document.getElementById('weatherWeekHumidity-' + i);
    humidity.innerHTML = Math.round(weatherData.daily[i].humidity) + '%';

    let temp = document.getElementById('weatherWeekTemp-' + i);
    temp.innerHTML = ('H: ' + Math.round(weatherData.daily[i].temp.max -273.15) + '&#176;' + '   L: ' + Math.round(weatherData.daily[i].temp.min -273.15) + '&#176;');
  }
}
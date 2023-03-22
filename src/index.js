import { head, set, toUpper, wrap } from "lodash";
import { moment } from "moment-es6";
import './style.css';

let weatherData;
let localTimezoneOffset;
let apiKey = 'eae1491e89f960425a0971c74103081f'

function initializeBaseDivs() {
  let headerDiv = document.createElement('div');
  headerDiv.setAttribute('id', 'header');
  document.body.appendChild(headerDiv);

  let contentDiv = document.createElement('div');
  contentDiv.setAttribute('id', 'content');
  document.body.appendChild(contentDiv);

  let weatherTodayDiv = document.createElement('div');
  weatherTodayDiv.setAttribute('id', 'weatherToday');
  contentDiv.appendChild(weatherTodayDiv);

  let extraInfoDiv = document.createElement('div');
  extraInfoDiv.setAttribute('id', 'extraInfo');
  contentDiv.appendChild(extraInfoDiv);

  let weatherWeekDiv = document.createElement('div');
  weatherWeekDiv.setAttribute('id', 'weatherWeek');
  contentDiv.appendChild(weatherWeekDiv);
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
  const response1 = await fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + City + '&limit=5&appid=' + apiKey, { mode: 'cors' });
  const geoData = await response1.json();
  const response2 = await fetch('https://api.openweathermap.org/data/3.0/onecall?lat=' + geoData[0].lat + '&lon=' + geoData[0].lon + '&appid=eae1491e89f960425a0971c74103081f', { mode: 'cors' });
  const data = await response2.json();
  return data;
}

function renderWeatherDivs() {
  drawWeatherNow();
  drawWeatherNext24Hours();
  drawExtraInfo();
  drawWeekWeather();
}

function weatherDataGeolocation() {
  if (navigator.geolocation) {
    drawLoadingIcon();
    navigator.geolocation.getCurrentPosition(async(position) => {
      weatherData = await userLocationWeatherData(position);
      removeLoadingIcon();
      console.log(weatherData);
      renderWeatherDivs();
      localTimezoneOffset = weatherData.timezone_offset;
      injectData(weatherData);
      animateWeatherDivCreation();
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
  headerInputBox.placeholder = 'Search for a City';
  headerInputDiv.appendChild(headerInputBox);

  let headerInputSubmit = document.createElement('button');
  headerInputSubmit.setAttribute('id', 'headerInputSubmit');
  headerInputSubmit.innerHTML = 'SEARCH'
  headerInputSubmit.onclick = async function() {
    let City = document.getElementById('headerInputBox').value;
    if (City === '') {
      alert('Please add a City to your search');
    } else {
      document.getElementById('headerInputBox').value = '';
      weatherDivRemoval();
      drawLoadingIcon();
      weatherData = await weatherDataFetch(City);
      removeLoadingIcon();
      console.log(weatherData);
      renderWeatherDivs();
      injectData(weatherData);
      animateWeatherDivCreation();
    }
  }
  headerInputDiv.appendChild(headerInputSubmit);

  let headerUnitButton = document.createElement('button');
  headerUnitButton.setAttribute('id', 'headerUnitButton');
  headerUnitButton.innerHTML = '&#176;C'
  wrapper.appendChild(headerUnitButton);
  headerUnitButton.onclick = function() {
    if (headerUnitButton.innerHTML === '°C') {
      headerUnitButton.innerHTML = '°F';
      injectData(weatherData);
    } else if (headerUnitButton.innerHTML === '°F') {
      headerUnitButton.innerHTML = '°C';
      injectData(weatherData);
    };
  }

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

  let wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'weatherWeekWrapper');

  let dayContainer = document.createElement('div')
  dayContainer.setAttribute('id', 'dayContainer');
  dayContainer.classList.add('weather-week-info-container');
  wrapper.appendChild(dayContainer);

  let iconContainer = document.createElement('div')
  iconContainer.setAttribute('id', 'iconContainer');
  iconContainer.classList.add('weather-week-info-container');
  wrapper.appendChild(iconContainer);

  let humidityContainer = document.createElement('div')
  humidityContainer.setAttribute('id', 'humidityContainer');
  humidityContainer.classList.add('weather-week-info-container');
  wrapper.appendChild(humidityContainer);

  let rainContainer = document.createElement('div')
  rainContainer.setAttribute('id', 'rainContainer');
  rainContainer.classList.add('weather-week-info-container');
  wrapper.appendChild(rainContainer);

  let tempContainer = document.createElement('div')
  tempContainer.setAttribute('id', 'tempContainer');
  tempContainer.classList.add('weather-week-info-container');
  wrapper.appendChild(tempContainer);

  container.appendChild(wrapper);

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

function drawLoadingIcon() {
  let container = document.createElement('div');
  container.setAttribute('id', 'loadingIconContainer');
  
  let loadingRing = document.createElement('div');
  loadingRing.setAttribute('id', 'loadingRing');
  container.appendChild(loadingRing);

  container.classList.add('draw-loading-icon');
  setTimeout(function() {
    container.classList.remove('draw-loading-icon');
  }, 500);

  document.body.appendChild(container);
}

function removeLoadingIcon() {
  let container = document.getElementById('loadingIconContainer');
  container.classList.add('remove-loading-icon');
  setTimeout(function() {
    container.classList.remove('remove-loading-icon');
    document.getElementById('loadingIconContainer').remove();
  }, 500);
}

function temperatureHandler(temp) {
  if (document.getElementById('headerUnitButton').innerHTML === '°C') {
    let calculatedTemp = Math.round(temp - 273.15);
    return calculatedTemp + '°';
  } else if (document.getElementById('headerUnitButton').innerHTML ==='°F') {
    let calculatedTemp = Math.round((temp - 273.15) * (9/5) + 32);
    return calculatedTemp + '°';
  } else {
    alert('This should not happen');
  }
}

function animateWeatherDivCreation() {
  let now = document.getElementById('weatherNow');
  now.classList.add('animate-div-creation-left');

  let hourly = document.getElementById('weather3Hour');
  hourly.classList.add('animate-div-creation-right');

  let extraInfo = document.getElementById('weatherExtraInfoWrapper');
  extraInfo.classList.add('animate-div-creation-right');

  let daily = document.getElementById('weatherWeekWrapper');
  daily.classList.add('animate-div-creation-left');

  setTimeout(function() {
    now.classList.remove('animate-div-creation-left');
    hourly.classList.remove('animate-div-creation-right');
    extraInfo.classList.remove('animate-div-creation-right');
    daily.classList.remove('animate-div-creation-left');
  }, 500);
}

function weatherDivRemoval() {
  let now = document.getElementById('weatherNow');
  now.classList.add('animate-div-removal-left');

  let hourly = document.getElementById('weather3Hour');
  hourly.classList.add('animate-div-removal-right');

  let extraInfo = document.getElementById('weatherExtraInfoWrapper');
  extraInfo.classList.add('animate-div-removal-right');

  let daily = document.getElementById('weatherWeekWrapper');
  daily.classList.add('animate-div-removal-left');

  setTimeout(function() {
    now.classList.remove('animate-div-removal-left');
    hourly.classList.remove('animate-div-removal-right');
    extraInfo.classList.remove('animate-div-removal-right');
    daily.classList.remove('animate-div-removal-left');
    document.getElementById('weatherNow').remove();
    document.getElementById('weather3Hour').remove();
    document.getElementById('weatherExtraInfoWrapper').remove();
    document.getElementById('weatherWeekWrapper').remove();
  }, 500);
}

async function dataFetch() {
  weatherDataGeolocation();
}

initializeBaseDivs();
drawHeader();
document.addEventListener("DOMContentLoaded", dataFetch, false);

function injectData(weatherData) {

  /* Current Weather Data Injection */
  let weatherNowLocationDiv = document.getElementById('weatherNowLocation');
  weatherNowLocationDiv.innerHTML = (weatherData.timezone);

  let weatherNowPatternDiv = document.getElementById('weatherNowPattern');
  weatherNowPatternDiv.innerHTML = (weatherData.current.weather[0].main);

  let weatherNowPatternImg = document.getElementById('weatherNowPatternImg');
  weatherNowPatternImg.src = ("http://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + ".png");

  let weatherNowTempDiv = document.getElementById('weatherNowTemp');
  weatherNowTempDiv.innerHTML = temperatureHandler(weatherData.current.temp);

  let weatherNowTempFeelsDiv = document.getElementById('weatherNowTempFeels');
  weatherNowTempFeelsDiv.innerHTML = ('Feels like ' + temperatureHandler(weatherData.current.feels_like));

  /* Per-Hour Weather Data Injection */
  for (let i = 1; i <24; i++) {
    let chanceOfRainDiv = document.getElementById('chanceOfRainDiv-' + i)
    chanceOfRainDiv.innerHTML = Math.round(weatherData.hourly[i].pop * 100) + '%';

    let dayWeatherIcon = document.getElementById('iconDiv-' + i);
    dayWeatherIcon.src = ("http://openweathermap.org/img/wn/" + weatherData.hourly[i].weather[0].icon + ".png");

    let tempDiv = document.getElementById('tempDiv-' + i)
    tempDiv.innerHTML = temperatureHandler(weatherData.hourly[i].temp);
  }

  /* Extra Info Weather Data Injection */
  let sunriseDiv = document.getElementById('weatherExtraInfoSunrise');
  let sunriseTime = new Date((weatherData.current.sunrise + weatherData.timezone_offset - localTimezoneOffset) * 1000).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
  sunriseDiv.innerHTML = sunriseTime;

  let sunsetDiv = document.getElementById('weatherExtraInfoSunset');
  let sunsetTime = new Date((weatherData.current.sunset + weatherData.timezone_offset - localTimezoneOffset) * 1000).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
  sunsetDiv.innerHTML = sunsetTime;

  let humidityDiv = document.getElementById('weatherExtraInfoHumidity');
  humidityDiv.innerHTML = (weatherData.current.humidity + '%');

  let precipitationDiv = document.getElementById('weatherExtraInfoPrecipitation');
  if (Object.hasOwn(weatherData.daily[0], 'rain')) {
    precipitationDiv.innerHTML = (Math.round(weatherData.daily[0].rain) + 'mm');
  } else {
    precipitationDiv.innerHTML = '0mm';
  }
  
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
    temp.innerHTML = ('H: ' + temperatureHandler(weatherData.daily[i].temp.max) + ' L: ' + temperatureHandler(weatherData.daily[i].temp.min));
  }
}
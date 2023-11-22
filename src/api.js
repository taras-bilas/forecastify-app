import axios from 'axios';

const APIKEY = "b24aa52f364ac2575e59e986ffb74fec";

export function getCityCoordinates(cityName) {
  return axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${1}&appid=${APIKEY}`
  );
}

export function getWeatherInfo(cityLatitude, cityLongitude) {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${cityLatitude}&lon=${cityLongitude}&appid=${APIKEY}&units=metric`
  );
}

export function getHourlyTemperature(cityName) {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKEY}&units=metric`
  );
}

<script>
import { ref, watchEffect } from 'vue';
import { useWeatherStore } from './../stores/pinia';
import HourlyTemperatureGraph from './HourlyTemperatureGraph.vue';

export default {
  components: {
    HourlyTemperatureGraph,
  },
  setup() {
    const weatherStore = useWeatherStore();

    const favoriteWeatherInfo = ref(weatherStore.favorites[0]);

    watchEffect(() => {
      favoriteWeatherInfo.value = weatherStore.favoriteWeatherInfo;
    });

    return {
      favoriteWeatherInfo,
    }
  }
}
</script>

<template>
  <div class="weather-info">
    <div class="weather-info__container">
      <div class="weather-info__info info">
        <h1 class="info__city-name">{{ favoriteWeatherInfo.name }}</h1>
        <h2 class="info__today">
          Today, {{ String(new Date().getHours()).padStart(2, '0') }}:{{ String(new Date().getMinutes()).padStart(2, '0')
          }}
        </h2>
        <p class="info__temperature">{{ Math.round(favoriteWeatherInfo.main.temp) }}&deg;C</p>
        <p class="info__feels-like">Feels like: {{ Math.round(favoriteWeatherInfo.main.feels_like) }}&deg;C</p>
        <p class="info__max-temperature">Max temperature: {{ Math.round(favoriteWeatherInfo.main.temp_max) }}&deg;C</p>
        <p class="info__min-temperature">Min temperature: {{ Math.round(favoriteWeatherInfo.main.temp_min) }}&deg;C</p>
        <p class="info__humidity">Humidity: {{ favoriteWeatherInfo.main.humidity }}%</p>
        <p class="info__pressure">Pressure: {{ favoriteWeatherInfo.main.pressure }} hPa</p>
        <p class="info__wind-speed">Wind speed: {{ Math.round(favoriteWeatherInfo.wind.speed) }} m/s</p>
      </div>
      <div class="weather-info__images images">
        <img
          :src="`https://openweathermap.org/img/w/${favoriteWeatherInfo.weather[0].icon}.png`"
          alt="Weather image"
          class="images__image"
        >
        <HourlyTemperatureGraph class="images__graph"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weather-info {
  display: flex;
  justify-content: center;
  margin: 20px 0 40px;
  color: #bbb;

  &__container {
    display: flex;

    @media (max-width: 767px) {
      padding: 0 20px;
    }
  }
}

.info {
  @media (max-width: 767px) {
    margin-right: 10px;
  }

  @media (min-width: 768px) {
    margin-right: 60px;
  }

  &__city-name,
  &__temperature {
    font-weight: 500;

    @media (max-width: 767px) {
      font-size: 25px;
    }

    @media (min-width: 768px) {
      font-size: 35px;
    }
  }

  &__today {
    margin-bottom: 30px;
    font-weight: 400;

    @media (max-width: 767px) {
      font-size: 15px;
    }

    @media (min-width: 768px) {
      font-size: 25px;
    }
  }

  &__temperature {
    margin-bottom: 15px;
  }

  &__feels-like,
  &__max-temperature,
  &__min-temperature,
  &__humidity,
  &__pressure {
    margin-bottom: 5px;
  }

  &__feels-like,
  &__max-temperature,
  &__min-temperature,
  &__humidity,
  &__pressure,
  &__wind-speed {
    @media (max-width: 767px) {
      font-size: 15px;
    }

    @media (min-width: 768px) {
      font-size: 20px;
    }
  }
}

.images {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__image {
    @media (max-width: 767px) {
      width: 120px;
      height: 120px;
    }

    @media (min-width: 768px) {
      width: 150px;
      height: 150px;
    }
  }

  &__graph {
    @media (max-width: 767px) {
      width: 150px;
      height: 150px;
    }

    @media (min-width: 768px) {
      width: 180px;
      height: 180px;
    }
  }
}
</style>
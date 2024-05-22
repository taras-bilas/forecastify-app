<script>
import { ref, watchEffect } from 'vue';
import { useMainStore } from '../stores/pinia';

export default {
  props: {
    weatherInfo: {
      type: Object,
    }
  },
  setup(props) {
    const mainStore = useMainStore();

    const weatherInfo = ref(props.weatherInfo);
    const currentTime = ref(mainStore.currentTime);
    const roundValue = ref(mainStore.roundValue);

    watchEffect(() => {
      weatherInfo.value = props.weatherInfo;
    });

    return {
      weatherInfo,
      currentTime,
      roundValue,
    }
  }
}
</script>

<template>
  <div class="weather-info" v-if="Object.keys(weatherInfo).length > 0">
    <div class="weather-info__content">
      <div class="info">
        <h1 class="info__city-name">
          {{ weatherInfo.name }}
        </h1>

        <h2 class="info__today">
          Today, {{ currentTime }}
        </h2>

        <p class="info__temperature" v-if="weatherInfo.main.temp">
          {{ roundValue(weatherInfo.main.temp) }}&deg;C
        </p>

        <p class="info__feels-like">
          Feels like: {{ roundValue(weatherInfo.main.feels_like) }}&deg;C
        </p>

        <p class="info__max-temperature">
          Max temperature: {{ roundValue(weatherInfo.main.temp_max) }}&deg;C
        </p>

        <p class="info__min-temperature">
          Min temperature: {{ roundValue(weatherInfo.main.temp_min) }}&deg;C
        </p>

        <p class="info__humidity">
          Humidity: {{ roundValue(weatherInfo.main.humidity) }}%
        </p>

        <p class="info__pressure">
          Pressure: {{ roundValue(weatherInfo.main.pressure) }} hPa
        </p>

        <p class="info__wind-speed">
          Wind speed: {{ roundValue(weatherInfo.wind.speed) }} m/s
        </p>
      </div>

      <img
        :src="`https://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png`"
        alt="Weather image"
        class="weather-info__image"
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './../utils/variables';

.weather-info {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 40px;
  color: $main-color;

  &__content {
    display: flex;
    align-items: center;
    gap: 10px;

    @media (min-width: $tablet-min-width) {
      gap: 60px;
    }
  }

  &__image {
    width: 120px;
    height: 120px;

    @media (min-width: $tablet-min-width) {
      width: 150px;
      height: 150px;
    }
  }
}

.info {

  &__city-name,
  &__temperature {
    font-weight: 500;
    font-size: 25px;

    @media (min-width: $tablet-min-width) {
      font-size: 35px;
    }
  }

  &__today {
    margin-bottom: 30px;
    font-weight: 400;
    font-size: 15px;

    @media (min-width: $tablet-min-width) {
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
    font-size: 15px;

    @media (min-width: $tablet-min-width) {
      font-size: 20px;
    }
  }
}
</style>
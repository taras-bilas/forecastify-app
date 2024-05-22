<script>
import { reactive, ref, watchEffect } from 'vue';
import {
  useWeatherStore,
  useFocusStore,
  useLoaderStore,
} from './../stores/pinia';
import WeatherCard from './WeatherCard.vue';
import Loader from './Loader.vue';

export default {
  components: {
    WeatherCard,
    Loader,
  },
  props: {
    cities: {
      type: Array,
    }
  },
  setup(props) {
    const weatherStore = useWeatherStore();
    const focusStore = useFocusStore();
    const loaderStore = useLoaderStore();

    const weatherInfo = ref(weatherStore.weatherInfo);
    const cities = ref(props.cities);

    const city = reactive({
      name: weatherStore.cityName,
    });

    const card = reactive({
      isLoading: loaderStore.isLoadingCard,
      isBeingDeleted: false,
      index: null,
    });

    watchEffect(() => {
      cities.value = props.cities;
      city.name = weatherStore.cityName;
      card.isLoading = loaderStore.isLoadingCard;
    });

    const onCard = (cityWeather) => {
      city.name = cityWeather.name;
      weatherInfo.value = cityWeather;

      weatherStore.setCityName(city.name);
      weatherStore.setWeatherInfo(weatherInfo.value);
    };

    const onAddNewCard = () => {
      focusStore.callSetFocus();
    };

    return {
      cities,
      card,
      onCard,
      onAddNewCard,
    };
  }
};
</script>

<template>
  <div class="cards">
    <div class="cards__container">
      <div v-if="!card.isLoading" v-for="cityWeather, index in cities" @click="onCard(cityWeather)" class="card">
        <WeatherCard :currentCityWeather="cityWeather" :currentCardIndex="index">
          <template #delete-icon="{ onDeleteFunction }">
            <slot name="delete-icon" :onDeleteFunction="onDeleteFunction"></slot>
          </template>
        </WeatherCard>
      </div>

      <Loader v-else />

      <slot name="blank-card" :onAddNewCardFunction="onAddNewCard" :card="card"></slot>
    </div>
  </div>
</template>

<style lang="scss">
@import './../utils/variables';

.cards {
  margin-bottom: 60px;
  padding-inline: 20px;

  @media (min-width: $tablet-min-width) {
    margin-bottom: 80px;
  }

  @media (min-width: $desktop-min-width) {
    margin-bottom: 120px;
  }

  &__container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax($mobile-card-width, $desktop-card-width));
    justify-content: center;
    gap: 20px;

    @media (min-width: $tablet-min-width) {
      gap: 30px;
    }
  }
}

.card {
  min-height: 175px;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  color: $card-text-color;
  background-color: $card-bc;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.1);
  }
}
</style>